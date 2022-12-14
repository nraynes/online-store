const { PrismaClient } = require('@prisma/client');
const catchPrisma = require('../utils/core/catchPrisma');
const crypto = require('crypto');
const tokenService = require('./token.service');
const userService = require('./user.service');
const respond = require('@/utils/core/respond');
const codes = require('@/config/responseCodes');
const config = require('@/config/config');
const pick = require('@/utils/formatters/pick');
const tokenTypes = require('@/config/tokens');
const { compareObjects } = require('@/utils/core/compare');
const log = require('@/utils/misc/log');
const fetch = require('cross-fetch');

const prisma = new PrismaClient();

/**
 * Create a unique dynamic salt value to be assigned to a user.
 * @returns {String || null}
 */
async function createUniqueDynamicSalt() {
  const maxCount = 50; // Max amount of times it will try to create unique dynamic salt before failing.
  // Make sure that random value picked is unique.
  let dynamicSalt;
  for (let i = 0; i < maxCount; i++) {
    dynamicSalt = crypto.randomBytes(16).toString('hex');
    const queryDynamicSalt = await catchPrisma(() => prisma.accounts.findFirst({
      select: { dynamic_salt: true },
      where: { dynamic_salt: dynamicSalt },
    }));
    if (queryDynamicSalt === null) {
      i = maxCount + 1;
    } else {
      dynamicSalt = null;
    }
  }
  return dynamicSalt;
}

/**
 * Reaches out to Google server to verify a captcha.
 * @param {String} captcha
 * @returns {Boolean}
 */
async function verifyCaptcha(captcha) {
  const googleResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secret}&response=${captcha}`)
    .then((response) => response.json());
  if (googleResponse && googleResponse.success) {
    return true;
  } else if (googleResponse) {
    if (Array.isArray(googleResponse['error-codes'])) {
      for (let i = 0;i < googleResponse['error-codes'].length;i++) {
        log(googleResponse['error-codes'][i]);
      }
    } else {
      log(googleResponse['error-codes']);
    }
  } else {
    log('No recaptcha response was recieved!');
  }
  return false;
}

/**
 * Logs a user in with an email and password and responds with the user object.
 * @param {String} email
 * @param {String} password
 * @param {Object} res
 * @returns {Object}
 */
async function loginUserWithEmailAndPassword(email, password, res) {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    respond(res, codes.notFound);
  } else if (!user.verified) {
    respond(res, codes.notVerified);
  } else {
    const salt = `${user.dynamic_salt}${config.static.salt}`;
    crypto.scrypt(password, salt, 96, {}, async (err, key) => {
      if (err) {
        respond(res, codes.failure);
        throw err;
      }
      if (user.password_hash === key.toString('base64')) {
        const filteredUser = pick(user, config.userPayloadKeys);
        const generatedTokens = await tokenService.generateTokens(filteredUser);
        if (generatedTokens) {
          log('Logged a user in successfully with this object:', filteredUser);
          respond(res, { user: filteredUser, tokens: generatedTokens });
        } else {
          respond(res, codes.failure);
        }
      } else {
        respond(res, codes.wrongPassword);
      }
    });
  }
}

/**
 * Checks to see if a refresh token exists for a given account.
 * @param {Number} account_id
 * @returns {Boolean}
 */
async function checkRefreshToken(account_id) {
  const token = await catchPrisma(() => prisma.tokens.findFirst({
    where: {
      account_id,
    }
  }));
  if (token) {
    return true;
  }
  return false;
}

/**
 * Checks to see if an access token is valid and grabs the user object to return.
 * @param {String} accessToken
 * @returns {Object || null}
 */
async function authMe(accessToken) {
  const decodedPayload = tokenService.verifyToken(accessToken, tokenTypes.ACCESS);
  if (decodedPayload) {
    const notLoggedOutOfAllDevices = await checkRefreshToken(decodedPayload.account_id);
    if (notLoggedOutOfAllDevices) {
      const filteredPayload = pick(decodedPayload, config.userPayloadKeys);
      const user = await userService.getUserByID(filteredPayload.account_id);
      if (user && user.verified && (compareObjects(filteredPayload, user))) {
        return filteredPayload;
      }
    }
  }
  return null;
}

/**
 * Generates a new access token using the users refresh token.
 * @param {String} refToken
 * @returns {String || null}
 */
async function refreshToken(refToken) {
  const decodedPayload = tokenService.verifyToken(refToken, tokenTypes.REFRESH);
  if (decodedPayload) {
    const filteredPayload = pick(decodedPayload, config.userPayloadKeys);
    const user = await userService.getUserByID(filteredPayload.account_id);
    if (user && user.verified && (compareObjects(filteredPayload, user))) {
      const accessToken = tokenService.generateAccessToken(filteredPayload);
      return accessToken;
    }
  }
  return null;
}

module.exports = {
  createUniqueDynamicSalt,
  verifyCaptcha,
  loginUserWithEmailAndPassword,
  authMe,
  refreshToken,
};

const { PrismaClient } = require('@prisma/client');
const catchPrisma = require('../utils/core/catchPrisma');
const crypto = require('crypto');
const emailService = require('./email.service');
const tempService = require('./temp.service');
const respond = require('@/utils/core/respond');
const codes = require('@/config/responseCodes');
const config = require('@/config/config');
const { compareObjects } = require('@/utils/core/compare');
const { encrypt, decrypt } = require('@/utils/core/AES');
const log = require('@/utils/misc/log');

const prisma = new PrismaClient();

/**
 * Gets a user matching a given email address.
 * @param {String} email
 * @returns {Object || null}
 */
const getUserByEmail = async (email) => {
  const queryEmail = config.useEncryption ? encrypt(email) : email;
  const user = await catchPrisma(() => prisma.accounts.findFirst({
    where: {
      email: {
        equals: queryEmail,
        mode: 'insensitive',
      },
      deleted_on: null,
    }
  }));
  if (config.useEncryption && user) {
    const decryptedEmail = decrypt(user.email);
    user.email = decryptedEmail;
  }
  return user;
};

/**
 * Gets a user matching a given account ID.
 * @param {Number} account_id
 * @returns {Object || null}
 */
const getUserByID = async (account_id) => {
  const user = await catchPrisma(() => prisma.accounts.findFirst({
    where: {
      account_id,
      deleted_on: null,
    }
  }));
  if (config.useEncryption && user) {
    const decryptedEmail = decrypt(user.email);
    user.email = decryptedEmail;
  }
  return user;
};

/**
 * Deletes a user with a given account ID. Returns whether or not it was successful.
 * @param {Number} account_id
 * @returns {Boolean}
 */
const deleteUserByID = async (account_id) => {
  const user = await catchPrisma(() => prisma.accounts.update({
    data: {
      deleted_on: new Date()
    },
    where: {
      account_id,
    },
  }));
  if (user.deleted_on) {
    return true;
  }
  return false;
};

/**
 * Creates a new user.
 * Does not return anything as it responds to the request.
 * @param {String} email
 * @param {String} password
 * @param {String} dynamicSalt
 * @param {Object} res
 */
async function createUser(email, password, dynamicSalt, res) {
  const checkIfUserExists = await getUserByEmail(email);
  if (checkIfUserExists) {
    respond(res, codes.alreadyExists);
  } else {
    const salt = `${dynamicSalt}${config.static.salt}`;
    crypto.scrypt(password, salt, 96, {}, async (err, key) => {
      if (err) {
        respond(res, codes.failure);
        throw err;
      }
      const password_hash = key.toString('base64');
      const userObject = {
        email: config.useEncryption ? encrypt(email) : email,
        password_hash,
        dynamic_salt: dynamicSalt,
        verified: false,
      };
      const newUser = await catchPrisma(() => prisma.accounts.create({
        data: userObject
      }));
      const tempKey = await tempService.generateEmailCode(newUser.account_id);
      if (newUser && compareObjects(userObject, newUser)) {
        if (tempKey) {
          const success = emailService.sendVerifyEmail(email, tempKey);
          if (success === 'NOCREDITS') {
            respond(res, codes.noCredits);
          } else if (success) {
            log('Created a new user with the this object:', userObject);
            log('This is the user that was created:', newUser);
            respond(res, codes.success);
          } else {
            respond(res, codes.failure);
          }
        } else {
          await deleteUserByID(newUser.account_id);
          respond(res, codes.failure);
        }
      } else {
        respond(res, codes.failure);
      }
    });
  }
}

/**
 * Verifies a users email. Returns whether or not it was successful.
 * @param {Number} account_id
 * @returns {Boolean}
 */
const verifyEmail = async (account_id) => {
  const updatedUser = await catchPrisma(() => prisma.accounts.update({
    data: {
      verified: true
    },
    where: {
      account_id,
    }
  }));
  if (updatedUser && updatedUser.verified) {
    return true;
  }
  return false;
};

/**
 * Edits user information. Returns whether it was successful or not.
 * @param {Number} account_id
 * @param {String} email
 * @returns {Boolean}
 */
const editUserInfo = async (account_id, email) => {
  const parcel = {
    email: config.useEncryption ? encrypt(email) : email,
  };
  const updatedUser = await catchPrisma(() => prisma.accounts.update({
    data: parcel,
    where: {
      account_id,
    }
  }));
  if (compareObjects(parcel, updatedUser)) {
    return true;
  }
  return false;
};

/**
 * Unverifies a user. Returns whether or not it was successful.
 * @param {Number} account_id
 * @returns {Boolean}
 */
const unverifyUser = async (account_id) => {
  const user = await catchPrisma(() => prisma.accounts.update({
    data: {
      verified: false,
    },
    where: {
      account_id,
    }
  }));
  if (user) {
    const tempKey = await tempService.generateEmailCode(account_id);
    if (tempKey) {
      const success = emailService.sendVerifyEmail(config.useEncryption ? decrypt(user.email) : user.email, tempKey);
      if (success === 'NOCREDITS') {
        return 'NOCREDITS';
      } else {
        return true;
      }
    }
  }
  return false;
};

/**
 * Adds a profile image to a users account. Returns whether or not it was successful.
 * @param {Number} account_id
 * @param {String} image
 * @returns {Boolean}
 */
const addImage = async (account_id, image) => {
  const success = await catchPrisma(() => prisma.accounts.update({
    data: {
      photo: image,
    },
    where: {
      account_id,
    }
  }));
  if (success) {
    return true;
  }
  return false;
};

/**
 * Removes a profile image from a users account. Returns whether or not it was successful.
 * @param {Number} account_id
 * @returns {Boolean}
 */
const removeImage = async (account_id) => {
  const success = await catchPrisma(() => prisma.accounts.update({
    data: {
      photo: null,
    },
    where: {
      account_id,
    }
  }));
  if (success) {
    return true;
  }
  return false;
};

module.exports = {
  createUser,
  getUserByID,
  deleteUserByID,
  getUserByEmail,
  verifyEmail,
  editUserInfo,
  unverifyUser,
  addImage,
  removeImage,
};

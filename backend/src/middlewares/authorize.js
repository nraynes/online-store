const respond = require('@/utils/core/respond');
const codes = require('@/config/responseCodes');
const tokenService = require('@/services/token.service');
const authService = require('@/services/auth.service');
const log = require('@/utils/misc/log');

// This is used to automatically grab the JWT from the headers and check if it is valid.
// You can also check if the user is an administrator with the is_admin key.
const authorize = (authorizeAdmin = false) => async (req, res, next) => {
  const token = tokenService.getTokenFromHeader(req);
  const user = await authService.authMe(token);
  if (
    !user
    || (authorizeAdmin && !user.is_admin
    )) {
    respond(res, codes.unauthorized);
    log('BLOCKED UNAUTHORIZED ENTRY');
    return null;
  }
  log('AUTHORIZED USER');
  req.user = user;
  return next();
};

module.exports = authorize;

// These are response codes to be used by the respond utility function.
// You can pass a response code to the respond function to automatically set a JSON code
// and status code in your response object.

const codes = {
  badAsyncCall: { message: 'ASYNCERROR', status: 500 },
  notValid: { message: 'NOTVALID', status: 400 },
  notVerified: { message: 'NOTVERIFIED', status: 400 },
  success: { message: 'SUCCESS', status: 200 },
  restored: { message: 'RESTORED', status: 200 },
  failure: { message: 'FAILURE', status: 500 },
  captchaFailed: { message: 'CAPTCHAFAILED', status: 401 },
  notFound: { message: 'NOTFOUND', status: 404 },
  forbidden: { message: 'FORBIDDEN', status: 403 },
  banned: { message: 'BANNED', status: 403 },
  alreadyExists: { message: 'ALREADYEXISTS', status: 409 },
  wrongPassword: { message: 'ERRPASS', status: 401 },
  invalidEmail: { message: 'BADEMAIL', status: 400 },
  conflict: { message: 'CONFLICT', status: 409 },
  unauthorized: { message: 'UNAUTHORIZED', status: 401 },
  locked: { message: 'LOCKED', status: 423 },
  expired: { message: 'EXPIRED', status: 401 },
  noCat: { message: 'NOCAT', status: 400 },
  tooLarge: { message: 'TOOLARGE', status: 503 },
  noCredits: { message: 'NOCREDITS', status: 503 },
};

module.exports = codes;

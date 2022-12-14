import { getToken } from '@/utils/browser/tokens';
import { apiURL } from '@/config/config';
import log from '@/utils/misc/log';

/**
 * Sends a request to the api url specified in the configuration with the given parameters.
 * Can automatically invlude authentication headers with JSON Web Tokens.
 * @param {Object}
 * * @param {Object} route
 * * @param {String} method
 * * @param {Object} body
 * * @param {Object} headers
 * * @param {Object} query
 * * @param {Boolean} includeAuth
 * * @param {Boolean} includeRefresh
 * @param {Number} count
 * @returns {Object}
 */
const acquire = async ({ route, method, body, headers, query, includeAuth, includeRefresh }, count = 0) => {
  let url = `${apiURL}${route}`;
  let giftBox = {
    method: method,
    headers: headers || {},
  };
  if (body) {
    giftBox.headers['Content-Type'] = 'application/JSON';
    giftBox.body = JSON.stringify(body);
  }
  if (query) {
    const initKeys = Object.keys(query);
    const initValues = Object.values(query);
    const keys = [];
    const values = [];
    for (let i = 0; i < initKeys.length; i++) {
      if (initValues[i]) {
        keys.push(initKeys[i]);
        values.push(initValues[i]);
      }
    }
    if (values.length > 0) {
      url += '?';
      for (let i = 0; i < keys.length; i++) {
        if (i !== 0) {
          url += '&';
        }
        url += `${keys[i]}=${values[i]}`;
      }
    }
  }
  if (includeAuth) {
    giftBox.headers.authorization = getToken('access');
  } else if (includeRefresh) {
    giftBox.headers.authorization = getToken('refresh');
  }
  log(`Fetching data from ${url} with object:`, giftBox);
  const response = await fetch(url, giftBox)
    .then(async (data) => ({ status: data.status, content: await data.json() }))
    .catch((err) => {
      log(err);
      return { status: null, content: 'FAILURE' };
    });
  log('Response recieved was:', response);
  if (response.content === 'UNAUTHORIZED') {
    await window.reloadUser();
    if (count < 1) {
      return acquire({ route, method, body, query, includeAuth, includeRefresh }, count + 1);
    }
  }
  return response;
};

export default acquire;
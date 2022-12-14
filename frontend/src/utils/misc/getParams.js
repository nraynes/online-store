/**
 * Gets a parameter from the url.
 * @param {String} name
 * @param {String} url
 * @returns {Object}
 */
function getParameterByName(name, url = window.location.href) {
  const paramName = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${paramName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default getParameterByName;

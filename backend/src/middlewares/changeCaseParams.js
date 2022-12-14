const log = require('@/utils/misc/log');
const { isObject } = require('@/utils/core/jsonUtils');

// Don't modify these parameters.
const exclusions = [];

// Exclusively only modify these parameters
const exclusives = [
  'email',
];

// Exclusively only modify these parameters to uppercase.
const upperCaseParams = [];

// Takes the req body, query, and params and changes all of the specified
// keys to either all lowercase or all uppercase.
const changeCase = (items) => {
  if (items && isObject(items, true)) {
    const itemKeys = Object.keys(items);
    const newItems = {};
    for (let i = 0; i < itemKeys.length; i++) {
      let curVal = items[itemKeys[i]];
      const curKey = itemKeys[i];
      if (typeof curVal === 'string') {
        if (exclusives.includes(curKey)) {
          curVal = curVal.toLowerCase();
        } else if (exclusives.length <= 0) {
          if (!exclusions.includes(curKey) && !upperCaseParams.includes(curKey)) {
            curVal = curVal.toLowerCase();
          } else if (upperCaseParams.includes(curKey)) {
            curVal = curVal.toUpperCase();
          } else if (Array.isArray(curVal)) {
            for (let j = 0; j < curVal.length; j++) {
              curVal[j] = changeCase(curVal[j]);
            }
          } else if (isObject(curVal)) {
            curVal = changeCase(curVal);
          }
        }
      }
      newItems[curKey] = curVal;
    }
    return newItems;
  }
  return items;
};

const changeCaseParams = () => (req, _res, next) => {
  log('Changing case except exclusions.');
  const { body, query, params } = req;
  req.body = changeCase(body);
  req.query = changeCase(query);
  req.params = changeCase(params);
  return next();
};

module.exports = changeCaseParams;

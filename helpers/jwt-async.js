const jwt = require("jsonwebtoken");
const promisify = (func) => (...args) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(func(...args));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = Object.keys(jwt)
  .filter((key) => !key.includes("Error"))
  .reduce((obj, key) => Object.assign(obj, { [key]: promisify(jwt[key]) }), {});

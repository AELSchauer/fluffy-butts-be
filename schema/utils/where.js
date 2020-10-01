const { camelCase } = require("lodash");

const getKeyName = (classPropName) =>
  "filter__" + camelCase(classPropName.split(".")[1]);

const whereWithStringProp = (classPropName, argVals) =>
  `${classPropName} IN (${argVals
    .split(",")
    .map((n) => `'${n}'`)
    .join(", ")})`;

module.exports = {
  whereWithStringProp,
};

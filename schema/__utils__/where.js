const whereWithStringProp = (classPropName, argVals) =>
  `${classPropName} IN (${argVals
    .split(",")
    .map((n) => `'${n}'`)
    .join(", ")})`;

module.exports = {
  whereWithStringProp
};

const whereWithStringProp = (args, propName, className) =>
  `${className}.${propName} IN (${args[propName]
    .split(",")
    .map((n) => `'${n}'`)
    .join(", ")})`;

module.exports = {
  whereWithStringProp,
};

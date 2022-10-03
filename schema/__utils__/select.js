const selectPropsInsensitive = ({ order_by = "" }, className) =>
  (order_by.match(/((\w+)_insensitive)/g) || []).map(
    (fieldName) =>
      `lower(${className}.${fieldName.replace(
        "_insensitive",
        ""
      )}) as ${fieldName}`
  );

module.exports = {
  selectPropsInsensitive,
};

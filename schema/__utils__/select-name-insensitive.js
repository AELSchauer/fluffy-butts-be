module.exports = ({ filter__name_insensitive = false, order_by = "" }, className) =>
  filter__name_insensitive || order_by.indexOf("name_insensitive") > -1
    ? `, lower(${className}.name) as name_insensitive`
    : "";

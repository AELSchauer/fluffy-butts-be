module.exports = (order_by = "id:asc", className) =>
  "ORDER BY " +
  order_by
    .replace(/:/g, " ")
    .replace(/asc/, "ASC")
    .replace(/desc/, "DESC")
    .split(/, ?/g)
    .map((o) => (o.indexOf("name_insensitive") > -1 ? o : `${className}.${o}`))
    .join(", ");

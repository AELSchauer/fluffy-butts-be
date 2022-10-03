module.exports = (order_by = "id:asc", className) =>
  "ORDER BY " +
  order_by
    .replace(/:/g, " ")
    .replace(/asc/, "ASC")
    .replace(/desc/, "DESC")
    .split(/, ?/g)
    .map((o) => (o.indexOf("_insensitive") > -1 ? o : `${className}.${o}`))
    .join(", ");

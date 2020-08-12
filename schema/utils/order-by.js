module.exports = (orderBy = "id:asc", className) =>
  "ORDER BY " +
  orderBy
    .replace(/:/g, " ")
    .replace(/asc/, "ASC")
    .replace(/desc/, "DESC")
    .split(/, ?/g)
    .map((o) => `${className}.${o}`)
    .join(", ");

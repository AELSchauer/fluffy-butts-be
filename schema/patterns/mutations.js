const { GraphQLNonNull, GraphQLString } = require("graphql");
const query = require("./query");

module.exports = {
  CreatePattern: {
    type: require("./type"),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      brand_id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { name, brand_id }) {
      return query
        .resolve({}, { filter__name: name, filter__brand: brand_id })
        .then(([row] = []) =>
          typeof row !== "undefined"
            ? row
            : client
                .query(
                  [
                    "INSERT INTO patterns (name, brand_id, created_at)",
                    `VALUES ('${name}', '${brand_id}', '${new Date().toISOString()}')`,
                    "RETURNING *;",
                  ].join(" ")
                )
                .then(({ rows: [row] = [] }) => row)
        )
        .catch((err) => err);
    },
  },
  DeletePattern: {
    type: require("./type"),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { id }) {
      return client
        .query(`DELETE FROM patterns WHERE id = ${id};`)
        .then(() => ({}))
        .catch((err) => err);
    },
  },
};

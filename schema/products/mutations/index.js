const { GraphQLInt, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = {
  CreateProduct: {
    type: require("../type"),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      pattern_id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      product_line_id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { name, pattern_id, product_line_id }) {
      return client
        .query(
          [
            "INSERT INTO products (name, pattern_id, product_line_id, created_at)",
            `VALUES ('${name}','${pattern_id}','${product_line_id}', '${new Date().toISOString()}')`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

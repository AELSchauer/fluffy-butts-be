const { GraphQLInt, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = {
  CreateBrand: {
    type: require("./type"),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { name }) {
      return client
        .query(
          [
            "INSERT INTO brands (name, created_at)",
            `VALUES ('${name}', '${new Date().toISOString()}')`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

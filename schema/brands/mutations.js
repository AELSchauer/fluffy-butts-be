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
  UpdateBrand: {
    type: require("./type"),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { id, name }) {
      return client
        .query(
          [
            "UPDATE brands",
            "SET",
            [
              `name = '${name}'`,
              `updated_at = '${new Date().toISOString()}'`,
            ].join(", "),
            `WHERE id = '${id}'`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

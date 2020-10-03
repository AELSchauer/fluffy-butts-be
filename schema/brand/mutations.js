// Conversion DONE! :D

const { GraphQLInt, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = {
  CreateBrand: {
    type: require("./type"),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    fields: {
      id: {
        type: GraphQLInt,
      },
      name: {
        type: GraphQLString,
      },
    },
    resolve(root, { name }) {
      return client
        .query(
          `
        INSERT INTO brands (name, created_at)
        VALUES ('${name}', '${new Date().toISOString()}')
        RETURNING *;
      `
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

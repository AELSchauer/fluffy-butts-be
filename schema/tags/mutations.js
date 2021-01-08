const { GraphQLInt, GraphQLNonNull, GraphQLString } = require("graphql");
const categoriesEnum = require("./categories-enum");

module.exports = {
  CreateTag: {
    type: require("./type"),
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      category: {
        type: new GraphQLNonNull(GraphQLString),
      },
      display_order: {
        type: GraphQLInt,
      },
    },
    resolve(root, { name, category, display_order }) {
      const categoryInt = categoriesEnum[category].value;
      return client
        .query(
          [
            "INSERT INTO tags (name, category, display_order, created_at)",
            `VALUES ('${name}','${categoryInt}','${display_order}', '${new Date().toISOString()}')`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

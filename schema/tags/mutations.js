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
        type: GraphQLString,
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
  UpdateTag: {
    type: require("./type"),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      category: {
        type: new GraphQLNonNull(GraphQLString),
      },
      display_order: {
        type: GraphQLString,
      },
    },
    resolve(root, { id, name, category, display_order }) {
      const categoryInt = (categoriesEnum[category] || {}).value || 0;
      return client
        .query(
          [
            "UPDATE tags",
            "SET",
            [
              `name = '${name}'`,
              category && `category = '${categoryInt}'`,
              display_order && `display_order = '${display_order}'`,
              `updated_at = '${new Date().toISOString()}'`,
            ]
              .filter(Boolean)
              .join(", "),
            `WHERE id = '${id}'`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

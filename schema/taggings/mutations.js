const { GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = {
  CreateTagging: {
    type: require("./type"),
    args: {
      tag_id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      taggable_id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      taggable_type: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { tag_id, taggable_id, taggable_type }) {
      return client
        .query(
          [
            "INSERT INTO taggings (tag_id, taggable_id, taggable_type, created_at)",
            `VALUES ('${tag_id}', '${taggable_id}', '${taggable_type}', '${new Date().toISOString()}')`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
  DeleteTagging: {
    type: require("./type"),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { id }) {
      return client
        .query(`DELETE FROM taggings WHERE id = ${id};`)
        .then(() => ({}))
        .catch((err) => err);
    },
  },
};

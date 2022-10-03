const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Tagging",
  fields: () => ({
    id: { type: GraphQLID },
    tag_id: { type: GraphQLString },
    taggable_id: { type: GraphQLString },
    taggable_type: { type: GraphQLString },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    tag: {
      type: require("../tags/type"),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT tags.*",
              "FROM tags",
              "LEFT JOIN taggings ON tags.id = taggings.tag_id",
              `WHERE tags.id = ${parent.tag_id}`,
            ].join(" ") + ";"
          )
          .then(({ rows: [row] }) => row);
      },
    },
  }),
});

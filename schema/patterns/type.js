const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = new GraphQLObjectType({
  name: "Pattern",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    brand: {
      type: require("../brands/type"),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT *",
              "FROM brands",
              `WHERE brands.id = ${parent.brand_id}`,
            ].join(" ")
          )
          .then(({ rows: [row] }) => row);
      },
    },
    products: {
      type: new GraphQLList(require("../products/type")),
      args: require("../products/query").args,
      resolve(parent, args) {
        return require("../product/query").resolve(parent, {
          ...args,
          filter__pattern: parent.id,
        });
      },
    },
    tags: {
      type: new GraphQLList(require("../tags/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT tags.*",
              "FROM tags",
              "LEFT JOIN taggings ON tags.id = taggings.tag_id",
              "WHERE taggable_type = 'Pattern'",
              `AND taggings.taggable_id = ${parent.id}`,
            ].join(" ") + ";"
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

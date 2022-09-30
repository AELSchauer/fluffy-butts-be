// Conversion DONE! :D

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Pattern",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    brand: {
      type: require("../brand/type"),
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
      type: new GraphQLList(require("../product/type")),
      args: require("../product/query").args,
      resolve(parent, args) {
        return require("../product/query").resolve(parent, {
          ...args,
          filter__pattern: parent.id,
        });
      },
    },
    tags: {
      type: new GraphQLList(require("../tag/type")),
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

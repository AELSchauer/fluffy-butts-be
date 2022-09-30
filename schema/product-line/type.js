// Conversion DONE! :D

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp, GraphQLJSON } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "ProductLine",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    display_order: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    brand: {
      type: require("../brand/type"),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM brands WHERE id = ${parent.brand_id}`)
          .then(({ rows: [row] }) => row);
      },
    },
    collections: {
      type: new GraphQLList(require("../collection/type")),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM collections WHERE product_line_id = ${parent.id}`
          )
          .then(({ rows }) => rows);
      },
    },
    images: {
      type: new GraphQLList(require("../image/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imageable_type = 'ProductLine'",
              `AND imagings.imageable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    patterns: {
      type: new GraphQLList(require("../pattern/type")),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.brand_id};`)
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("../product/type")),
      args: require("../product/query").args,
      resolve(parent, args) {
        return require("../product/query").resolve(parent, {
          ...args,
          filter__product_line: parent.id,
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
              "WHERE taggable_type = 'ProductLine'",
              `AND taggings.taggable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

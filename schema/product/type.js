// Conversion DONE! :D

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

module.exports = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    brand: {
      type: require("../brand/type"),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT brands.* FROM brands",
              "LEFT JOIN product_lines ON product_lines.brand_id = brands.id",
              "LEFT JOIN products ON products.product_line_id = product_lines.id",
              `WHERE products.id = ${parent.id};`,
            ].join(" ")
          )
          .then(({ rows: [row] }) => row);
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
              "WHERE imageable_type = 'Product'",
              `AND imagings.imageable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    listings: {
      type: new GraphQLList(require("../listing/type")),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM listings WHERE listable_type = 'Product' AND listable_id = ${parent.id};`
          )
          .then(({ rows }) => rows);
      },
    },
    pattern: {
      type: require("../pattern/type"),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE id = ${parent.pattern_id};`)
          .then(({ rows: [row] = [] }) => row);
      },
    },
    product_line: {
      type: require("../product-line/type"),
      args: require("../product-line/query").args,
      resolve(parent, args) {
        return require("../product-line/query")
          .resolve(parent, {
            ...args,
            filter__id: parent.product_line_id,
          })
          .then(([row]) => row);
      },
    },
    tags: {
      type: new GraphQLList(require("../tag/type")),
      resolve(parent, args) {
        return require("../tag/query").resolve(parent, {
          ...args,
          custom: {
            query: ["LEFT JOIN taggings ON tags.id = taggings.tag_id"],
            where: [
              `(taggable_type = 'ProductLine' AND taggings.taggable_id = '${parent.product_line_id}') OR (taggable_type = 'Pattern' AND taggings.taggable_id = '${parent.pattern_id}')`,
            ],
          },
        });
      },
    },
  }),
});

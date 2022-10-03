const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp, GraphQLJSON } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    details: { type: GraphQLJSON },
    pattern_id: { type: GraphQLString },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    brand: {
      type: require("../brands/type"),
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
      type: new GraphQLList(require("../images/type")),
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
      type: new GraphQLList(require("../listings/type")),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM listings WHERE listable_type = 'Product' AND listable_id = ${parent.id};`
          )
          .then(({ rows }) => rows);
      },
    },
    pattern: {
      type: require("../patterns/type"),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE id = ${parent.pattern_id};`)
          .then(({ rows: [row] = [] }) => row);
      },
    },
    product_line: {
      type: require("../product-lines/type"),
      args: require("../product-lines/query").args,
      resolve(parent, args) {
        return require("../product-lines/query")
          .resolve(parent, {
            ...args,
            filter__id: parent.product_line_id,
          })
          .then(([row]) => row);
      },
    },
    tags: {
      type: new GraphQLList(require("../tags/type")),
      resolve(parent, args) {
        return require("../tags/query").resolve(parent, {
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

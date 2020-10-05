// Conversion DONE! :D

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = new GraphQLObjectType({
  name: "Brand",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    images: {
      type: new GraphQLList(require("../image/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imageable_type = 'Brand'",
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
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
    product_lines: {
      type: new GraphQLList(require("../product-line/type")),
      args: require("../product-line/query").args,
      resolve(parent, args) {
        return require("../product-line/query").resolve(
          {},
          { ...args, filter__brand: parent.id }
        );
      },
    },
    products: {
      type: new GraphQLList(require("../product-line/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT products.* FROM products",
              "LEFT JOIN product_lines ON product_lines.id = products.product_line_id",
              "LEFT JOIN brands ON product_lines.brand_id = brands.id",
              `WHERE brands.id = ${parent.id};`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

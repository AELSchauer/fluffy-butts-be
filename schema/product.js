/*
TODO
- filter_available
- filter_availability
*/

const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");
const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    brand: {
      type: require("./brand").BrandType,
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
      type: new GraphQLList(require("./image").ImageType),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imagable_type = 'Product'",
              `AND imagings.imagable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    listings: {
      type: new GraphQLList(require("./listing").ListingType),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM listings WHERE listable_type = 'Product' AND listable_id = ${parent.pattern_id};`
          )
          .then(({ rows }) => rows);
      },
    },
    pattern: {
      type: new GraphQLList(require("./pattern").PatternType),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE id = ${parent.pattern_id};`)
          .then(({ rows }) => rows);
      },
    },
    product_line: {
      type: new GraphQLList(require("./product-line").ProductLineType),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM product_lines WHERE id = ${parent.product_line_id};`
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

const ProductEndpoint = {
  type: new GraphQLList(ProductType),
  args: {
    filter_orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
    filter_name_insensitive: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT products.* FROM products"];
    let where = [];
    if (!!args.filter_id) where.push(`products.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("products.name", args.filter_name));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "products"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  ProductEndpoint,
  ProductType,
};

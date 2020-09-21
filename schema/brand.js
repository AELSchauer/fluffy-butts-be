// Conversion DONE! :D

const _ = require("lodash");
const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const BrandType = new GraphQLObjectType({
  name: "Brand",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    name_insensitive: { type: GraphQLString },
    // origin_country: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    images: {
      type: new GraphQLList(require("./image").ImageType),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imagable_type = 'Brand'",
              `AND imagings.imagable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    patterns: {
      type: new GraphQLList(require("./pattern").PatternType),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
    product_lines: {
      type: new GraphQLList(require("./product-line").ProductLineType),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM product_lines WHERE brand_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("./product-line").ProductLineType),
      resolve(parent, args) {
        return client
          .query([
            "SELECT products.* FROM products",
            "LEFT JOIN product_lines ON product_lines.id = products.product_line_id",
            "LEFT JOIN brands ON product_lines.brand_id = brands.id",
            `WHERE brands.id = ${parent.id};`,
          ].join(" "))
          .then(({ rows }) => rows);
      },
    },
  }),
});

const BrandEndpoint = {
  type: new GraphQLList(BrandType),
  args: {
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
    filter_nameInsensitive: { type: GraphQLString },
  },
  resolve(parent, args) {
    console.log(args);
    let query = ["SELECT DISTINCT brands.* FROM brands"];
    let where = [];
    if (!!args.filter_id) where.push(`brands.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("brands.name", args.filter_name));
    if (!!args.filter_nameInsensitive)
      where.push(whereWithStringProp("brands.name_insensitive", args.filter_nameInsensitive));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "brands"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  BrandEndpoint,
  BrandType,
};

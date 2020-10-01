// Conversion DONE! :D

const _ = require("lodash");
const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const selectNameInsensitive = require("./utils/select-name-insensitive");
const order_by = require("./utils/order-by");
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
              "WHERE imageable_type = 'Brand'",
              `AND imagings.imageable_id = ${parent.id}`,
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
      args: require("./product-line").ProductLineEndpoint.args,
      resolve(parent, args) {
        return require("./product-line").ProductLineEndpoint.resolve(
          {},
          { ...args, filter__brand: parent.id }
        );
      },
    },
    products: {
      type: new GraphQLList(require("./product-line").ProductLineType),
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

const BrandEndpoint = {
  type: new GraphQLList(BrandType),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__name_insensitive: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = [
      `SELECT DISTINCT brands.* ${selectNameInsensitive(
        args,
        "brands"
      )} FROM brands`,
    ];
    let where = [];
    if (!!args.filter__id) where.push(`brands.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("brands.name", args.filter__name));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "brands"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  BrandEndpoint,
  BrandType,
};

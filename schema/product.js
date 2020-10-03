// Conversion DONE! :D

const _ = require("lodash");
const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

const selectNameInsensitive = require("./utils/select-name-insensitive");
const order_by = require("./utils/order-by");
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
              "WHERE imageable_type = 'Product'",
              `AND imagings.imageable_id = ${parent.id}`,
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
            `SELECT * FROM listings WHERE listable_type = 'Product' AND listable_id = ${parent.id};`
          )
          .then(({ rows }) => rows);
      },
    },
    pattern: {
      type: require("./pattern").PatternType,
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE id = ${parent.pattern_id};`)
          .then(({ rows: [row] = [] }) => row);
      },
    },
    product_line: {
      type: require("./product-line").ProductLineType,
      args: require("./product-line").ProductLineEndpoint.args,
      resolve(parent, args) {
        return require("./product-line")
          .ProductLineEndpoint.resolve(parent, {
            ...args,
            filter__id: parent.product_line_id,
          })
          .then(([row]) => row);
      },
    },
    tags: {
      type: new GraphQLList(require("./tag").TagType),
      resolve(parent, args) {
        return require("./tag").TagEndpoint.resolve(parent, {
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

const ProductEndpoint = {
  type: new GraphQLList(ProductType),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__name_insensitive: { type: GraphQLString },
    filter__available: { type: GraphQLBoolean },
    filter__availability: { type: GraphQLString },
    filter__tag_names: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = [
      `SELECT DISTINCT products.* ${selectNameInsensitive(
        args,
        "products"
      )} FROM products`,
    ];
    let where = [];
    if (!!args.filter__id) where.push(`products.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("products.name", args.filter__name));
    if (!!args.filter__product_line)
      where.push(`products.product_line_id IN (${args.filter__product_line})`);
    if (!!args.filter__pattern)
      where.push(`products.pattern_id IN (${args.filter__pattern})`);
    if (typeof args.filter__available !== "undefined") {
      query.push(
        "LEFT JOIN listings ON listings.listable_type = 'Product' AND listings.listable_id = products.id"
      );
      where.push(
        `listings.sizes @> '[{"available": ${args.filter__available} }]'`
      );
    }
    if (!!args.filter__availability) {
      query.push(
        "LEFT JOIN listings ON listings.listable_type = 'Product' AND listings.listable_id = products.id",
        "LEFT JOIN retailers ON listings.retailer_id = retailers.id"
      );
      where.push(
        `retailers.shipping -> 'ships_to' @> '[{"country": "${args.filter__availability}" }]'`
      );
    }

    return client
      .query(
        [
          ..._.uniq(query),
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "products"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  ProductEndpoint,
  ProductType,
};

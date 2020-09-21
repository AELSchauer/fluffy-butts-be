/*
TODO
- Collections
*/


const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const ProductLineType = new GraphQLObjectType({
  name: "ProductLine",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    display_order: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    brand: {
      type: require("./brand").BrandType,
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
    images: {
      type: new GraphQLList(require("./image").ImageType),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imagable_type = 'ProductLine'",
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
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.brand_id};`)
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("./product").ProductType),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM products WHERE product_line_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
    tags: {
      type: new GraphQLList(require("./tag").TagType),
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

const ProductLineEndpoint = {
  type: new GraphQLList(ProductLineType),
  args: {
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
    filter_brand: { type: GraphQLString },
    filter_tags: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT product_lines.* FROM product_lines"];
    let where = [];
    if (!!args.filter_id) where.push(`product_lines.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("product_lines.name", args.filter_name));
    if (!!args.filter_brand)
      where.push(`product_lines.brand_id IN (${args.filter_brand})`);
    if (!!args.filter_tags) {
      query.push("INNER JOIN taggings ON product_lines.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'ProductLine'");
      where.push(`taggings.taggable_id IN (${args.filter_tags})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "product_lines"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  ProductLineEndpoint,
  ProductLineType,
};

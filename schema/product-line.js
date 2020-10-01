// Conversion DONE! :D

const {
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
          .query(`SELECT * FROM brands WHERE id = ${parent.brand_id}`)
          .then(({ rows: [row] }) => row);
      },
    },
    collections: {
      type: new GraphQLList(require("./collection").CollectionType),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM collections WHERE product_line_id = ${parent.id}`
          )
          .then(({ rows }) => rows);
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
              "WHERE imageable_type = 'ProductLine'",
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
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.brand_id};`)
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("./product").ProductType),
      args: require("./product").ProductEndpoint.args,
      resolve(parent, args) {
        return require("./product").ProductEndpoint.resolve(parent, {
          ...args,
          filter__product_line: parent.id,
        });
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
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__brand: { type: GraphQLString },
    filter__tags: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = [
      `SELECT DISTINCT product_lines.* ${selectNameInsensitive(
        args,
        "product_lines"
      )} FROM product_lines`,
    ];
    let where = [];
    if (!!args.filter__id)
      where.push(`product_lines.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("product_lines.name", args.filter__name));
    if (!!args.filter__brand)
      where.push(`product_lines.brand_id IN (${args.filter__brand})`);
    if (!!args.filter__tags) {
      query.push("INNER JOIN taggings ON product_lines.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'ProductLine'");
      where.push(`taggings.taggable_id IN (${args.filter__tags})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "product_lines"),
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

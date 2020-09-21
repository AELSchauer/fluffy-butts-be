// Conversion DONE! :D

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const PatternType = new GraphQLObjectType({
  name: "Pattern",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
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
    products: {
      type: new GraphQLList(require("./product").ProductType),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT *",
              "FROM products",
              `WHERE products.pattern_id = ${parent.id}`,
            ].join(" ") + ";"
          )
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
              "WHERE taggable_type = 'Pattern'",
              `AND taggings.taggable_id = ${parent.id}`,
            ].join(" ") + ";"
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

const PatternEndpoint = {
  type: new GraphQLList(PatternType),
  args: {
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
    filter_brand: { type: GraphQLString },
    filter_tags: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT patterns.* FROM patterns"];
    let where = [];
    if (!!args.filter_id) where.push(`patterns.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("patterns.name", args.filter_name));
    if (!!args.filter_brand)
      where.push(`patterns.brand_id IN (${args.filter_brand})`);
    if (!!args.filter_tags) {
      query.push("INNER JOIN taggings ON patterns.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'Pattern'");
      where.push(`taggings.taggable_id IN (${args.filter_tags})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "patterns"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  PatternEndpoint,
  PatternType,
};

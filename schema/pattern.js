// Conversion DONE! :D

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const order_by = require("./utils/order-by");
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
      args: require("./product").ProductEndpoint.args,
      resolve(parent, args) {
        return require("./product").ProductEndpoint.resolve(parent, {
          ...args,
          filter__pattern: parent.id,
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
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__brand: { type: GraphQLString },
    filter__tags: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT patterns.* FROM patterns"];
    let where = [];
    if (!!args.filter__id) where.push(`patterns.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("patterns.name", args.filter__name));
    if (!!args.filter__brand)
      where.push(`patterns.brand_id IN (${args.filter__brand})`);
    if (!!args.filter__tags) {
      query.push("INNER JOIN taggings ON patterns.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'Pattern'");
      where.push(`taggings.taggable_id IN (${args.filter__tags})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "patterns"),
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

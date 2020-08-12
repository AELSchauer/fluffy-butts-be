const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const { TagType } = require("./tags");
const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const PatternType = new GraphQLObjectType({
  name: "Pattern",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    created_at: { type: GraphQLInt },
    updated_at: { type: GraphQLInt },
    tags: {
      type: new GraphQLList(TagType),
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
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    brand: { type: GraphQLString },
    tags: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT patterns.* FROM patterns"];
    let where = [];
    if (!!args.id) where.push(`patterns.id IN (${args.id})`);
    if (!!args.name) where.push(whereWithStringProp(args, "name", "patterns"));

    if (!!args.brand) where.push(`patterns.brand_id IN (${args.brand})`);
    if (!!args.tags) {
      query.push("INNER JOIN taggings ON patterns.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'Pattern'");
      where.push(`taggings.taggable_id IN (${args.tags})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.order_by, "patterns"),
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

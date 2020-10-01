// Conversion DONE! :D

const {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const order_by = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const categoriesEnum = {
  TBD: {
    value: 0,
  },
  COLOR: {
    value: 1,
  },
  PATTERN_AND_THEME: {
    value: 2,
  },
  FEATURES: {
    value: 3,
  },
  AGE: {
    value: 4,
  },
  PRODUCT_TYPE: {
    value: 5,
  },
  PRODUCT_SERIES: {
    value: 6,
  },
};

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    category: {
      type: new GraphQLEnumType({
        name: "TagCategoryEnum",
        values: categoriesEnum,
      }),
    },
    display_order: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

const TagEndpoint = {
  type: new GraphQLList(TagType),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__category: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT tags.* FROM tags"];
    let where = [];
    if (!!args.filter__id) where.push(`tags.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("tags.name", args.filter__name));
    if (!!args.filter__category)
      where.push(whereWithStringProp("tags.category", args.filter__category));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "tags"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  categoriesEnum,
  TagEndpoint,
  TagType,
};

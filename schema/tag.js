// Conversion DONE! :D

const {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const categoriesEnum = {
  TBD: {
    value: 0,
  },
  COLOR: {
    value: 1,
  },
  PATTERN_THEME: {
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
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

const TagEndpoint = {
  type: new GraphQLList(TagType),
  args: {
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
    filter_category: { type: GraphQLString },
  },
  resolve(parent, args) {
    console.log(parent, args);
    let query = ["SELECT DISTINCT tags.* FROM tags"];
    let where = [];
    if (!!args.filter_id) where.push(`tags.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("tags.name", args.filter_name));
    if (!!args.filter_category)
      where.push(whereWithStringProp("tags.category", args.filter_category));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "tags"),
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

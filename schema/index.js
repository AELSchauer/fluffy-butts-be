const _ = require("lodash");
const { GraphQLString, GraphQLNonNull } = require("graphql");
const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    brands: require("./brand/query"),
    listings: require("./listing/query"),
    patterns: require("./pattern/query"),
    product_lines: require("./product-line/query"),
    products: require("./product/query"),
    retailers: require("./retailer/query"),
    tags: require("./tag/query"),
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...require("./brand/mutations"),
    ...require("./listing/mutations"),
    ...require("./product/mutations"),
  },
});

module.exports = new GraphQLSchema({
  mutation: RootMutation,
  query: RootQuery,
});

const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    brands: require("./brand/query"),
    listings: require("./listing/query"),
    patterns: require("./pattern/query"),
    product_lines: require("./product-line/query"),
    products: require("./product/query"),
    retailers: require("./retailer/query"),
    tags: require("./tag/query"),
    ...require("./user/queries"),
  },
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...require("./brand/mutations"),
    ...require("./listing/mutations"),
    ...require("./pattern/mutations"),
    ...require("./product/mutations"),
  },
});

module.exports = new GraphQLSchema({
  mutation: RootMutation,
  query: RootQuery,
});

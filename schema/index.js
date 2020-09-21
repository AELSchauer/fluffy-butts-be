const _ = require("lodash");
const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    brands: require("./brand").BrandEndpoint,
    patterns: require("./pattern").PatternEndpoint,
    product_lines: require("./product-line").ProductLineEndpoint,
    products: require("./product").ProductEndpoint,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

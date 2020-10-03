const _ = require("lodash");
const { GraphQLString, GraphQLNonNull } = require("graphql");
const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    brands: require("./brand").BrandQuery,
    listings: require("./listing").ListingEndpoint,
    patterns: require("./pattern").PatternEndpoint,
    product_lines: require("./product-line").ProductLineEndpoint,
    products: require("./product").ProductEndpoint,
    retailers: require("./retailer").RetailerEndpoint,
    tags: require("./tag").TagEndpoint,
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...require('./brand/mutations')
  },
});

module.exports = new GraphQLSchema({
  mutation: RootMutation,
  query: RootQuery,
});

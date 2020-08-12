const _ = require("lodash");
const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { BrandEndpoint } = require("./brand");
const { PatternEndpoint } = require("./pattern");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    brands: BrandEndpoint,
    patterns: PatternEndpoint,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

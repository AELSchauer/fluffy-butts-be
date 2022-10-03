const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    brands: require("./brands/query"),
    listings: require("./listings/query"),
    patterns: require("./patterns/query"),
    product_lines: require("./product-lines/query"),
    products: require("./products/query"),
    retailers: require("./retailers/query"),
    taggings: require("./taggings/query"),
    tags: require("./tags/query"),
    ...require("./users/queries"),
  },
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...require("./brands/mutations"),
    ...require("./listings/mutations"),
    ...require("./patterns/mutations"),
    ...require("./product-lines/mutations"),
    ...require("./products/mutations"),
    ...require("./taggings/mutations"),
    ...require("./tags/mutations"),
  },
});

module.exports = new GraphQLSchema({
  mutation: RootMutation,
  query: RootQuery,
});

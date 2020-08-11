const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require("graphql");
const BrandType = require("./brand");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    brands: {
      type: BrandType,
    },
    brand: {
      type: BrandType,
      args: { id: { type: GraphQLString } },
      resolve(parent, { id }) {
        // code to get data from DB
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = require("graphql");

module.exports = new GraphQLObjectType({
  name: "Pattern",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    created_at: { type: GraphQLInt },
    updated_at: { type: GraphQLInt },
  }),
});

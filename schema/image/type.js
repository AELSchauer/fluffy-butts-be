// Conversion DONE! :D

const { GraphQLID, GraphQLObjectType, GraphQLString } = require("graphql");
const { GraphQLTimestamp } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
  }),
});

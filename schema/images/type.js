const { GraphQLID, GraphQLObjectType, GraphQLString } = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

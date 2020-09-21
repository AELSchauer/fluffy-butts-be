// Conversion DONE! :D

const { GraphQLID, GraphQLObjectType, GraphQLString } = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

module.exports = {
  ImageType,
};

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    created_at: { type: GraphQLInt },
    updated_at: { type: GraphQLInt },
  }),
});

module.exports = {
  TagType
}
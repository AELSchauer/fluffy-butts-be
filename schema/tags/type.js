const {
  GraphQLEnumType,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    category: {
      type: new GraphQLEnumType({
        name: "TagCategoryEnum",
        values: require("./categories-enum"),
      }),
    },
    display_order: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

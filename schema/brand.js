const { GraphQLObjectType, GraphQLString } = require("graphql");

module.exports = new GraphQLObjectType({
  name: "Brand",
  fields: () => ({
    id: { type: GraphQString },
    name: { type: GraphQLString },
    name_insensitive: { type: GraphQLString },
    origin_country: { type: GraphQLString },
    created_at: { type: GraphQString },
    updated_at: { type: GraphQString },
  }),
});

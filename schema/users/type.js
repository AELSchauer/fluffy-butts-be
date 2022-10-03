const {
  GraphQLEnumType,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    encrypted_password: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: "UserRoleEnum",
        values: require("./roles-enum"),
      }),
    },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

const {
  GraphQLEnumType,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp } = require("graphql-scalars");

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
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
  }),
});

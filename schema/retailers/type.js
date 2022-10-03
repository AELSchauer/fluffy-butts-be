const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp, GraphQLJSON } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Retailer",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    shipping: { type: GraphQLJSON },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    listings: {
      type: new GraphQLList(require("../listings/type")),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM listings WHERE retailer_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
  }),
});

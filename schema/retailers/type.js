const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

module.exports = new GraphQLObjectType({
  name: "Retailer",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    shipping: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
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

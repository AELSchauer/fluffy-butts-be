// Conversion DONE! :D

const {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} = require("graphql");
const { GraphQLTimestamp, GraphQLJSON } = require("graphql-scalars");
const pluralize = require("pluralize");
const ProductType = require("../product/type");

module.exports = new GraphQLObjectType({
  name: "Listing",
  fields: () => ({
    id: { type: GraphQLID },
    countries: { type: GraphQLJSON },
    currency: { type: GraphQLString },
    listable_id: { type: GraphQLInt },
    listable_type: { type: GraphQLString },
    price: { type: GraphQLFloat },
    sizes: { type: GraphQLJSON },
    url: { type: GraphQLString },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    listable: {
      type: new GraphQLUnionType({
        name: "Listable",
        types: [ProductType],
        resolveType(value) {
          if (value.type === "Product") {
            return ProductType;
          }
        },
      }),
      resolve(parent, args) {
        return client
          .query(
            [
              `SELECT * FROM ${pluralize(parent.listable_type.toLowerCase())}`,
              `WHERE id = ${parent.listable_id}`,
            ].join(" ")
          )
          .then(({ rows: [row] }) => ({ type: parent.listable_type, ...row }));
      },
    },
    retailer: {
      type: require("../retailer/type"),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM retailers WHERE id = ${parent.retailer_id}`)
          .then(({ rows: [row] }) => row);
      },
    },
  }),
});

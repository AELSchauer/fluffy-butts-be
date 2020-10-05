// Conversion DONE! :D

const {
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { GraphQLJSON } = require("graphql-type-json");

module.exports = {
  CreateListing: {
    type: require("./type"),
    args: {
      countries: {
        type: GraphQLJSON,
      },
      currency: {
        type: new GraphQLNonNull(GraphQLString),
      },
      price: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      sizes: {
        type: new GraphQLNonNull(GraphQLJSON),
      },
      url: {
        type: new GraphQLNonNull(GraphQLString),
      },
      listable_id: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      listable_type: {
        type: new GraphQLNonNull(GraphQLString),
      },
      retailer_id: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve(
      root,
      {
        countries,
        currency,
        price,
        sizes,
        url,
        listable_type,
        listable_id,
        retailer_id,
      }
    ) {
      console.log(
        [
          "INSERT INTO listings (countries, currency, price, sizes, url, listable_id, listable_type, retailer_id, created_at)",
          `VALUES (${countries}, '${currency}', '${price}', '${sizes}', '${url}', '${listable_id}', '${listable_type}', '${retailer_id}', '${new Date().toISOString()}')`,
          "RETURNING *;",
        ].join(" ")
      );
      return client
        .query(
          [
            "INSERT INTO listings (countries, currency, price, sizes, url, listable_id, listable_type, retailer_id, created_at)",
            `VALUES (${countries}, '${currency}', '${price}', '${sizes}', '${url}', '${listable_id}', '${listable_type}', '${retailer_id}', '${new Date().toISOString()}')`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
};

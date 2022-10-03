const {
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { GraphQLJSON } = require("graphql-scalars");
const query = require("./query");

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
      return query
        .resolve(
          {},
          {
            filter__currency: currency,
            filter__listableId: listable_id,
            filter__listableType: listable_type,
            filter__retailer: retailer_id,
          }
        )
        .then(([row] = []) =>
          typeof row !== "undefined"
            ? row
            : client
                .query(
                  [
                    "INSERT INTO listings (countries, currency, price, sizes, url, listable_id, listable_type, retailer_id, created_at)",
                    `VALUES (${countries}, '${currency}', '${price}', '${sizes}', '${url}', '${listable_id}', '${listable_type}', '${retailer_id}', '${new Date().toISOString()}')`,
                    "RETURNING *;",
                  ].join(" ")
                )
                .then(({ rows: [row] = [] }) => row)
                .catch((err) => err)
        );
    },
  },
  UpdateListing: {
    type: require("./type"),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      countries: {
        type: GraphQLJSON,
      },
      currency: {
        type: GraphQLString,
      },
      price: {
        type: GraphQLFloat,
      },
      sizes: {
        type: GraphQLJSON,
      },
      url: {
        type: GraphQLString,
      },
    },
    resolve(root, { id, countries, currency, price, sizes, url }) {
      return client
        .query(
          [
            "UPDATE listings",
            "SET",
            [
              countries && `countries = '${countries}'`,
              currency && `currency = '${currency}'`,
              price && `price = '${price}'`,
              sizes && `sizes = '${sizes}'`,
              url && `url = '${url}'`,
              `updated_at = '${new Date().toISOString()}'`,
            ]
              .filter(Boolean)
              .join(", "),
            `WHERE id = '${id}'`,
            "RETURNING *;",
          ].join(" ")
        )
        .then(({ rows: [row] = [] }) => row)
        .catch((err) => err);
    },
  },
  DeleteListings: {
    type: require("./type"),
    args: {
      ids: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { ids }) {
      return client
        .query(`DELETE FROM listings WHERE id IN (${ids});`)
        .then(() => ({}))
        .catch((err) => err);
    },
  },
};

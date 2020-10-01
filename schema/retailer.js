// Conversion DONE! :D

const _ = require("lodash");
const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

const selectNameInsensitive = require("./utils/select-name-insensitive");
const order_by = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const RetailerType = new GraphQLObjectType({
  name: "Retailer",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    shipping: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    listings: {
      type: new GraphQLList(require("./listing").ListingType),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM listings WHERE retailer_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
  }),
});

const RetailerEndpoint = {
  type: new GraphQLList(RetailerType),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__name_insensitive: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = [
      `SELECT DISTINCT retailers.* ${selectNameInsensitive(
        args,
        "retailers"
      )} FROM retailers`,
    ];
    let where = [];
    if (!!args.filter__id) where.push(`retailers.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("retailers.name", args.filter__name));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "retailers"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  RetailerEndpoint,
  RetailerType,
};

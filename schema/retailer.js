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
const orderBy = require("./utils/order-by");
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
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT retailers.* FROM retailers"];
    let where = [];
    if (!!args.filter_id) where.push(`retailers.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("retailers.name", args.filter_name));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "retailers"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  RetailerEndpoint,
  RetailerType,
};

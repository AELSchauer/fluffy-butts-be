// Conversion DONE! :D

const { GraphQLList, GraphQLString } = require("graphql");
const order_by = require("../__utils__/order-by");
const { whereWithStringProp } = require("../__utils__/where");

module.exports = {
  type: new GraphQLList(require("./type")),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__retailer: { type: GraphQLString },
    filter__listableId: { type: GraphQLString },
    filter__listableType: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT listings.* FROM listings"];
    let where = [];
    if (!!args.filter__id) where.push(`listings.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("listings.name", args.filter__name));
    if (!!args.filter__retailer)
      where.push(`listings.retailer_id IN (${args.filter__retailer})`);
    if (!!args.filter__listableType && !!args.filter__listableId) {
      where.push(`listings.listable_type = '${args.filter__listableType}'`);
      where.push(`listings.listable_id IN (${args.filter__listableId})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "listings"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

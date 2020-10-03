// Conversion DONE! :D

const _ = require("lodash");
const { GraphQLList, GraphQLString } = require("graphql");
const order_by = require("../__utils__/order-by");
const { whereWithStringProp } = require("../__utils__/where");

module.exports = {
  type: new GraphQLList(require("./type")),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT brands.* FROM brands"];
    let where = [];
    if (!!args.filter__id) where.push(`brands.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("brands.name", args.filter__name));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "brands"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

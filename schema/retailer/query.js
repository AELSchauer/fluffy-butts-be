// Conversion DONE! :D

const { GraphQLList, GraphQLString } = require("graphql");
const selectNameInsensitive = require("../__utils__/select-name-insensitive");
const order_by = require("../__utils__/order-by");
const { whereWithStringProp } = require("../__utils__/where");

module.exports = {
  type: new GraphQLList(require("./type")),
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

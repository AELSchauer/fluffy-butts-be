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
    let query = ["SELECT DISTINCT collections.* FROM collections"];
    let where = [];
    if (!!args.filter__id) where.push(`collections.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("collections.name", args.filter__name));
    if (!!args.filter__product_line)
      where.push(`collections.product_line_id IN (${args.filter__product_line})`);

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "collections"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

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
    let query = ["SELECT DISTINCT bulk_packs.* FROM bulk_packs"];
    let where = [];
    if (!!args.filter__id) where.push(`bulk_packs.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("bulk_packs.name", args.filter__name));
    if (!!args.filter__product_line)
      where.push(`bulk_packs.product_line_id IN (${args.filter__product_line})`);

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "bulk_packs"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

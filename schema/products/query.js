const _ = require("lodash");
const { GraphQLBoolean, GraphQLList, GraphQLString } = require("graphql");
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
    filter__available: { type: GraphQLBoolean },
    filter__availability: { type: GraphQLString },
    filter__tag_names: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = [
      `SELECT DISTINCT products.* ${selectNameInsensitive(
        args,
        "products"
      )} FROM products`,
    ];
    let where = [];
    if (!!args.filter__id) where.push(`products.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("products.name", args.filter__name));
    if (!!args.filter__product_line)
      where.push(`products.product_line_id IN (${args.filter__product_line})`);
    if (!!args.filter__pattern)
      where.push(`products.pattern_id IN (${args.filter__pattern})`);
    if (typeof args.filter__available !== "undefined") {
      query.push(
        "LEFT JOIN listings ON listings.listable_type = 'Product' AND listings.listable_id = products.id"
      );
      where.push(
        `listings.sizes @> '[{"available": ${args.filter__available} }]'`
      );
    }
    if (!!args.filter__availability) {
      query.push(
        "LEFT JOIN listings ON listings.listable_type = 'Product' AND listings.listable_id = products.id",
        "LEFT JOIN retailers ON listings.retailer_id = retailers.id"
      );
      where.push(
        `retailers.shipping -> 'ships_to' @> '[{"country": "${args.filter__availability}" }]'`
      );
    }

    return client
      .query(
        [
          ..._.uniq(query),
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "products"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

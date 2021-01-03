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
    filter__brand: { type: GraphQLString },
    filter__tags: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = [
      `SELECT DISTINCT product_lines.* ${selectNameInsensitive(
        args,
        "product_lines"
      )} FROM product_lines`,
    ];
    let where = [];
    if (!!args.filter__id)
      where.push(`product_lines.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("product_lines.name", args.filter__name));
    if (!!args.filter__brand)
      where.push(`product_lines.brand_id IN (${args.filter__brand})`);
    if (!!args.filter__tags) {
      query.push("INNER JOIN taggings ON product_lines.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'ProductLine'");
      where.push(`taggings.taggable_id IN (${args.filter__tags})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "product_lines"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

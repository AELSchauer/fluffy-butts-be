const { GraphQLList, GraphQLString } = require("graphql");
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
    let query = ["SELECT DISTINCT patterns.* FROM patterns"];
    let where = [];
    if (!!args.filter__id) where.push(`patterns.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("patterns.name", args.filter__name));
    if (!!args.filter__brand)
      where.push(`patterns.brand_id IN (${args.filter__brand})`);
    if (!!args.filter__tags) {
      query.push("INNER JOIN taggings ON patterns.id = taggings.tag_id");
      where.push("taggings.taggable_type = 'Pattern'");
      where.push(`taggings.taggable_id IN (${args.filter__tags})`);
    }
    console.log(args, where)

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "patterns"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

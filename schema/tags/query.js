const { GraphQLList, GraphQLString } = require("graphql");
const order_by = require("../__utils__/order-by");
const { whereWithStringProp } = require("../__utils__/where");

module.exports = {
  type: new GraphQLList(require("./type")),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__category: { type: GraphQLString },
  },
  resolve(
    parent,
    { custom: { query: customQuery = [], where = [] } = {}, ...args }
  ) {
    let query = ["SELECT DISTINCT tags.* FROM tags"];
    if (!!args.filter__id) where.push(`tags.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("tags.name", args.filter__name));
    if (!!args.filter__category)
      where.push(whereWithStringProp("tags.category", args.filter__category));

    return client
      .query(
        [
          ...query.concat(customQuery),
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "tags"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

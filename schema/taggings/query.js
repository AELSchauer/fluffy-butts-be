const { GraphQLList, GraphQLString } = require("graphql");
const order_by = require("../__utils__/order-by");
const { whereWithStringProp } = require("../__utils__/where");

module.exports = {
  type: new GraphQLList(require("./type")),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__tag_id: { type: GraphQLString },
    // filter__taggable_type: { type: GraphQLString },
    // filter__taggable_id: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT taggings.* FROM taggings"];
    let where = [];
    if (!!args.filter__id) where.push(`taggings.id IN (${args.filter__id})`);
    if (!!args.filter__tag_id)
      where.push(whereWithStringProp("taggings.tag_id", args.filter__tag_id));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "taggings"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

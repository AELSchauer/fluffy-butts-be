const { GraphQLList, GraphQLString } = require("graphql");
const { whereWithStringProp } = require("../../__utils__/where");

module.exports = {
  type: new GraphQLList(require("../type")),
  args: {
    filter__id: { type: GraphQLString },
    filter__email: { type: GraphQLString },
    filter__username: { type: GraphQLString },
    filter__emailOrUsername: { type: GraphQLString },
    filter__role: { type: GraphQLString },
  },
  resolve(parent, { ...args }) {
    let where = [];
    let query = ["SELECT DISTINCT users.* FROM users"];
    if (!!args.filter__id) where.push(`users.id IN (${args.filter__id})`);
    if (!!args.filter__emailOrUsername)
      where.push(
        [
          whereWithStringProp("users.username", args.filter__emailOrUsername),
          whereWithStringProp("users.email", args.filter__emailOrUsername),
        ].join(" OR ")
      );
    if (!!args.filter__username)
      where.push(whereWithStringProp("users.username", args.filter__username));
    if (!!args.filter__email)
      where.push(whereWithStringProp("users.email", args.filter__email));
    if (!!args.filter__category)
      where.push(whereWithStringProp("users.role", args.filter__role));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
        ].join(" ")
      )
      .then(({ rows = [] }) => rows)
      .catch(() => []);
  },
};
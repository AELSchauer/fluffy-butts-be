/*
TODO
- enum category
*/

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { whereWithStringProp } = require("./utils/where");

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  }),
});

const TagEndpoint = {
  type: new GraphQLList(TagType),
  args: {
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
    filter_category: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT tags.* FROM tags"];
    let where = [];
    if (!!args.filter_id) where.push(`tags.id IN (${args.filter_id})`);
    if (!!args.filter_name) where.push(whereWithStringProp("tags.name", args.filter_name));
    if (!!args.filter_category)
      where.push(whereWithStringProp("tags.category", args.filter_category));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "tags"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  TagEndpoint,
  TagType,
};

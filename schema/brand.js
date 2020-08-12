const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const { PatternType } = require("./pattern");
const orderBy = require('./utils/order-by')
const { whereWithStringProp } = require("./utils/where");

const BrandType = new GraphQLObjectType({
  name: "Brand",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    name_insensitive: { type: GraphQLString },
    origin_country: { type: GraphQLString },
    created_at: { type: GraphQLInt },
    updated_at: { type: GraphQLInt },
    patterns: {
      type: new GraphQLList(PatternType),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.id};`)
          .then(({ rows }) => rows);
      },
    },
  }),
});

const BrandEndpoint = {
  type: new GraphQLList(BrandType),
  args: {
    order_by: { type: GraphQLString },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    name_insensitive: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT brands.* FROM brands"];
    let where = [];
    if (!!args.id) where.push(`brands.id IN (${args.id})`);
    if (!!args.name) where.push(whereWithStringProp(args, "name", "patterns"));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.order_by, "brands")
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  BrandEndpoint,
  BrandType,
};

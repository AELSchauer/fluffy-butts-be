// Conversion DONE! :D

const _ = require("lodash");
const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLJSON } = require("graphql-type-json");
const { GraphQLDateTime } = require("graphql-iso-date");
const orderBy = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const CollectionType = new GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    product_lines: {
      type: new GraphQLList(require("./product-line").ProductLineType),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM product_lines WHERE id = ${parent.product_line_id};`
          )
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("./product-line").ProductLineType),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT products.* FROM products",
              "LEFT JOIN collection_products ON products.id = collection_products.product_id",
              `WHERE collection_products.collection_id = ${parent.id};`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

const CollectionEndpoint = {
  type: new GraphQLList(CollectionType),
  args: {
    orderBy: { type: GraphQLString },
    filter_id: { type: GraphQLString },
    filter_name: { type: GraphQLString },
  },
  resolve(parent, args) {
    console.log(args);
    let query = ["SELECT DISTINCT brands.* FROM brands"];
    let where = [];
    if (!!args.filter_id) where.push(`brands.id IN (${args.filter_id})`);
    if (!!args.filter_name)
      where.push(whereWithStringProp("brands.name", args.filter_name));

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          orderBy(args.orderBy, "brands"),
        ].join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  CollectionEndpoint,
  CollectionType,
};

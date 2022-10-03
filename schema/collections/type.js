const _ = require("lodash");
const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp, GraphQLJSON } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    product_lines: {
      type: new GraphQLList(require("../product-lines/type")),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM product_lines WHERE id = ${parent.product_line_id};`
          )
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("../products/type")),
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

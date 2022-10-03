const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLTimestamp } = require("graphql-scalars");

module.exports = new GraphQLObjectType({
  name: "Brand",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    name_insensitive: { type: GraphQLString },
    created_at: { type: GraphQLTimestamp },
    updated_at: { type: GraphQLTimestamp },
    images: {
      type: new GraphQLList(require("../images/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imageable_type = 'Brand'",
              `AND imagings.imageable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    patterns: {
      type: new GraphQLList(require("../patterns/type")),
      args: require("../patterns/query").args,
      resolve(parent, args) {
        return require("../patterns/query").resolve(parent, {
          ...args,
          filter__brand: parent.id,
        })
      },
    },
    product_lines: {
      type: new GraphQLList(require("../product-lines/type")),
      args: require("../product-lines/query").args,
      resolve(parent, args) {
        return require("../product-lines/query").resolve(
          {},
          { ...args, filter__brand: parent.id }
        );
      },
    },
    products: {
      type: new GraphQLList(require("../product-lines/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT products.* FROM products",
              "LEFT JOIN product_lines ON product_lines.id = products.product_line_id",
              "LEFT JOIN brands ON product_lines.brand_id = brands.id",
              `WHERE brands.id = ${parent.id};`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");

module.exports = new GraphQLObjectType({
  name: "ProductLine",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    display_order: { type: GraphQLString },
    details: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    brand: {
      type: require("../brands/type"),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM brands WHERE id = ${parent.brand_id}`)
          .then(({ rows: [row] }) => row);
      },
    },
    collections: {
      type: new GraphQLList(require("../collections/type")),
      resolve(parent, args) {
        return client
          .query(
            `SELECT * FROM collections WHERE product_line_id = ${parent.id}`
          )
          .then(({ rows }) => rows);
      },
    },
    images: {
      type: new GraphQLList(require("../images/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT images.*",
              "FROM images",
              "LEFT JOIN imagings ON images.id = imagings.image_id",
              "WHERE imageable_type = 'ProductLine'",
              `AND imagings.imageable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    patterns: {
      type: new GraphQLList(require("../patterns/type")),
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM patterns WHERE brand_id = ${parent.brand_id};`)
          .then(({ rows }) => rows);
      },
    },
    products: {
      type: new GraphQLList(require("../products/type")),
      args: require("../products/query").args,
      resolve(parent, args) {
        return require("../products/query").resolve(parent, {
          ...args,
          filter__product_line: parent.id,
        });
      },
    },
    taggings: {
      type: new GraphQLList(require("../taggings/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT taggings.*",
              "FROM taggings",
              "WHERE taggings.taggable_type = 'ProductLine'",
              `AND taggings.taggable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
    tags: {
      type: new GraphQLList(require("../tags/type")),
      resolve(parent, args) {
        return client
          .query(
            [
              "SELECT tags.*",
              "FROM tags",
              "LEFT JOIN taggings ON tags.id = taggings.tag_id",
              "WHERE taggable_type = 'ProductLine'",
              `AND taggings.taggable_id = ${parent.id}`,
            ].join(" ")
          )
          .then(({ rows }) => rows);
      },
    },
  }),
});

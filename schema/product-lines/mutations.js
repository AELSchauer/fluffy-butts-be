const { GraphQLNonNull, GraphQLString } = require("graphql");
const query = require("./query");
const productQuery = require("../products/query");
const collectionQuery = require("../collections/query");
const deletePolyProductListingDependencies = require("../products/mutations/delete-polymorphic-dependencies");
const deletePolyCollectionListingDependencies = require("../collections/mutations/delete-polymorphic-dependencies");

module.exports = {
  DeleteProductLine: {
    type: require("./type"),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve(root, { id }) {
      return Promise.all([
        productQuery.resolve({}, { filter__product_line: id }),
        collectionQuery.resolve({}, { filter__product_line: id }),
      ])
        .then(([products, collections]) => {
          return Promise.all([
            deletePolyProductListingDependencies(products.map(({ id }) => id)),
            deletePolyCollectionListingDependencies(
              collections.map(({ id }) => id)
            ),
          ]);
        })
        .then(() => client.query(`DELETE FROM product_lines WHERE id = ${id};`))
        .catch((e) => {
          console.error(e);
        });
    },
  },
};

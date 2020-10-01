// Conversion DONE! :D

const {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSON } = require("graphql-type-json");
const pluralize = require("pluralize");
const order_by = require("./utils/order-by");
const { whereWithStringProp } = require("./utils/where");

const { ProductType } = require(`./product`);

const ListingType = new GraphQLObjectType({
  name: "Listing",
  fields: () => ({
    id: { type: GraphQLID },
    countries: { type: GraphQLJSON },
    currency: { type: GraphQLString },
    listable_id: { type: GraphQLInt },
    listable_type: { type: GraphQLString },
    price: { type: GraphQLFloat },
    sizes: { type: GraphQLJSON },
    url: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
    listable: {
      type: new GraphQLUnionType({
        name: "Listable",
        types: [ProductType],
        resolveType(value) {
          if (value.type === "Product") {
            return ProductType;
          }
        },
      }),
      resolve(parent, args) {
        return client
          .query(
            [
              `SELECT * FROM ${pluralize(parent.listable_type.toLowerCase())}`,
              `WHERE id = ${parent.listable_id}`,
            ].join(" ")
          )
          .then(({ rows: [row] }) => ({ type: parent.listable_type, ...row }));
      },
    },
    retailer: {
      type: require("./retailer").RetailerType,
      resolve(parent, args) {
        return client
          .query(`SELECT * FROM retailers WHERE id = ${parent.retailer_id}`)
          .then(({ rows: [row] }) => row);
      },
    },
  }),
});

const ListingEndpoint = {
  type: new GraphQLList(ListingType),
  args: {
    order_by: { type: GraphQLString },
    filter__id: { type: GraphQLString },
    filter__name: { type: GraphQLString },
    filter__retailer: { type: GraphQLString },
    filter__listableId: { type: GraphQLString },
    filter__listableType: { type: GraphQLString },
  },
  resolve(parent, args) {
    let query = ["SELECT DISTINCT listings.* FROM listings"];
    let where = [];
    if (!!args.filter__id) where.push(`listings.id IN (${args.filter__id})`);
    if (!!args.filter__name)
      where.push(whereWithStringProp("listings.name", args.filter__name));
    if (!!args.filter__retailer)
      where.push(`listings.retailer_id IN (${args.filter__retailer})`);
    if (!!args.filter__listableType && !!args.filter__listableId) {
      where.push(`listings.listable_type = '${args.filter__listableType}'`);
      where.push(`listings.listable_id IN (${args.filter__listableId})`);
    }

    return client
      .query(
        [
          ...query,
          ...(where.length ? ["WHERE"].concat(where.join(" AND ")) : []),
          order_by(args.order_by, "listings"),
        ]
          .filter(Boolean)
          .join(" ")
      )
      .then(({ rows }) => rows);
  },
};

module.exports = {
  ListingEndpoint,
  ListingType,
};

const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const BrandType = require("./brand");

const sampleBrandData = require("../sample-data/brands");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    brands: {
      type: new GraphQLList(BrandType),
      resolve(parent, args){
        return sampleBrandData;
      }
    },
    brand: {
      type: BrandType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return _.find(sampleBrandData, { id: args.id });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

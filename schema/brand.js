const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");
const PatternType = require("./pattern");

const patternSampleData = require('../sample-data/patterns')

module.exports = new GraphQLObjectType({
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
        return _.filter(patternSampleData, { brand_id: parent.id });
      },
    },
  }),
});

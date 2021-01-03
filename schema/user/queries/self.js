const { GraphQLList } = require("graphql");

module.exports = {
  type: new GraphQLList(require("../type")),
  resolve(parent, args, { user }) {
    return [user];
  },
};
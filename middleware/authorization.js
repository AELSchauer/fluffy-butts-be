const { rule, shield, and, or, not } = require("graphql-shield");

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => typeof ctx.user !== "undefined"
);

const hasRole = (role) =>
  rule({ cache: "contextual" })(
    async (parent, args, ctx, info) => ctx.user.role === role
  );

module.exports = shield(
  {
    Query: {
      self: isAuthenticated,
      users: hasRole("ADMIN"),
    },
    Mutation: {
      '*': hasRole("ADMIN"),
    },
  },
  {
    fallbackError: new Error(
      JSON.stringify({ code: 401, message: "Not authorized" })
    ),
  }
);

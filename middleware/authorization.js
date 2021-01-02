const { rule, shield, and, or, not } = require("graphql-shield");


// Rules

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user !== null;
  }
);

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === "admin";
  }
);

const isEditor = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === "editor";
  }
);


// Permissions

module.exports = shield({
  Query: {
    brands: not(isAuthenticated),
  },
  Mutation: {
    CreateBrand: isAuthenticated,
  },
});

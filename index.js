const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const app = new express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000);

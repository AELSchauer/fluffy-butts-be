const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { Client } = require("pg");

const { db: dbVars } = require("./config/variables");
global.client = new Client(dbVars);
client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

const app = new express();

const schema = require("./schema");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000);

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { Client } = require("pg");

const dbVars = require("dotenv").config().parsed;
global.client = new Client(dbVars);
client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

const app = new express();
// app.use(require('./middleware/convert-keys'));

const schema = require("./schema");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000);

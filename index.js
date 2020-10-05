const { Client } = require("pg");
const cors = require("cors");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

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

app.use(cors({ origin: "*" }));
app.use("/graphql", (req, res) => {
  graphqlHTTP({
    schema: require("./schema"),
    graphiql: true,
  })(req, res);
});

app.listen(8000);

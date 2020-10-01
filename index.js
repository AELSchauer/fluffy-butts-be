const express = require("express");
const cors = require("cors");
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
app.use(cors());

const schema = require("./schema");

app.use("/graphql", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  graphqlHTTP({
    schema,
    graphiql: true,
  })(req, res);
});

app.listen(3000);

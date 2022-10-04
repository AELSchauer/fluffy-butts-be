require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { Client } = require("pg");

global.client = new Client(
  Object.assign(
    {
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    process.env.NODE_ENV !== "development" && {
      ssl: { rejectUnauthorized: false },
    }
  )
);

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

const app = new express();

app.use(cors());

app.use("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  graphqlHTTP({
    schema: require("./schema"),
    graphiql: true,
  })(req, res);
});

app.listen(process.env.PORT);
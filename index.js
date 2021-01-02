const { Client } = require("pg");
const cors = require("cors");
const { GraphQLServer } = require("graphql-yoga");

const dbVars = require("dotenv").config().parsed;
global.client = new Client(dbVars);
client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

const options = {
  port: 8000,
  playground: '/playground'
};

const server = new GraphQLServer({ schema: require("./schema") });
server.start(options, ({ port }) =>
  console.log(`Server is running on localhost:${port}`)
);

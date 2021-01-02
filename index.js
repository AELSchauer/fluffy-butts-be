const { Client } = require("pg");
const { GraphQLServer } = require("graphql-yoga");
const { authentication, authorization } = require("./middleware");

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
  playground: "/playground",
};

const server = new GraphQLServer({
  schema: require("./schema"),
  middlewares: [authorization],
  context: (req) => ({
    ...req,
    user: authentication.getUser(req),
  }),
});
server.start(options, ({ port }) =>
  console.log(`Server is running on localhost:${port}`)
);

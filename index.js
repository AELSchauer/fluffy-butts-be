require("dotenv").config();
const { createClient } = require("redis");
const { Client } = require("pg");
const { GraphQLServer } = require("graphql-yoga");
const { authentication, authorization } = require("./middleware");
const bodyParser = require("body-parser");

global.redis = createClient();
global.client = new Client(process.env.dbVars);
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
  formatResponse: ({ data, errors = [] }) => ({
    data,
    errors:
      errors.length === 0
        ? undefined
        : errors.map(({ message, ...error }) => {
            try {
              return {
                ...JSON.parse(message),
                ...error,
              };
            } catch (err) {
              return {
                message,
                ...error,
              };
            }
          }),
  }),
};

const server = new GraphQLServer({
  schema: require("./schema"),
  middlewares: [authorization],
  context: async (req) => ({
    ...req,
    user: await authentication.getUser(req),
  }),
});

server.express.use(bodyParser.json());
server.express.post("/login", authentication.login);
server.express.post("/logout", authentication.logout);
server.express.post("/refresh", authentication.refresh);

server.start(options, ({ port }) =>
  console.log(`Server is running on localhost:${port}`)
);

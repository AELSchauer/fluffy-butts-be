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

// const verifyToken = (req, res, next) => {
//   jwt.verify(req.headers.authorization, "secret", (err, decoded) => {
//     if (err) {
//       return res.send(401);
//     }
//     next();
//   });
// };
// verifyToken.unless = unless;

const app = new express();

app.use(cors());
// app.use(verifyToken.unless({ path: ["/auth"] }));

// app.post("/auth", (req, res) => {
//   const token = jwt.sign({ foo: "bar" }, "secret");
//   res.send(token);
// });

app.use("/graphql", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  graphqlHTTP({
    schema: require("./schema"),
    // rootValue: root,
    graphiql: true,
  })(req, res);
});

app.listen(3000);

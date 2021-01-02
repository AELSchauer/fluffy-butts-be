require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("redis").createClient();

/// Auth

const users = {
  mathew: {
    id: 1,
    name: "aelschauer",
    encrypted_password:
      "$2b$10$MyxIJ/FgB0B2CkEJU9387OvT4rM3e4gbf0.ggjjeWxn8e1LLNfeeG",
    role: "admin",
  },
  george: {
    id: 2,
    name: "George",
    role: "editor",
  },
  johnny: {
    id: 3,
    name: "Johnny",
    role: "customer",
  },
};

const getUser = (ctx) => {
  const auth = ctx.request.get("Authorization");
  if (users[auth]) {
    return users[auth];
  } else {
    return null;
  }
};

const login = (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  return client
    .query(
      `SELECT * FROM users WHERE username = '${emailOrUsername}' OR email = '${emailOrUsername}'`
    )
    .then(({ rows: [{ encrypted_password, ...user }] = [] } = {}) =>
      Promise.all([user, bcrypt.compare(password, encrypted_password)])
    )
    .then(([{ id, email, username }, isAuthenticated]) => {
      if (isAuthenticated) {
        const accessToken = jwt.sign(
          { id, email, username },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1d",
          }
        );
        redis.set(id, accessToken, "EX", 24 * 60 * 60, (err) => {
          if (err) {
            res.send({ error: "Server error" });
          } else {
            res.json({
              accessToken,
            });
          }
        });
      } else {
        res.send({ error: "Login credentials invalid" });
      }
    });
};

const logout = (req, res, next) => {
  redis.get("1", (err, reply) => {
    console.log('err', err)
    console.log('reply', reply)
  })
};

const refresh = (req, res, next) => {};

module.exports = {
  getUser,
  login,
  logout,
  refresh,
};

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRoleEnum = require("../schema/user/roles-enum");
const usersQuery = require("../schema/user/query").users;

/// Auth
const verifyToken = (ctx) => {
  const auth = ctx.request.get("authorization");
  if (typeof auth === "undefined") {
    return;
  }

  const token = auth.split(/^Bearer /)[1];
  if (!token) {
    return new Error(
      JSON.stringify({ code: 400, message: "Authorization malformed" })
    );
  }

  try {
    return jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (e) {
    return new Error(JSON.stringify({ code: 400, message: "Token invalid" }));
  }
};

const getUser = async (ctx) => {
  try {
    const { id } = verifyToken(ctx) || {};
    if (!id) {
      return;
    }

    const [{ role: roleInt = 0, ...user } = {}] = await usersQuery.resolve(
      {},
      { filter__id: id }
    );
    return {
      ...user,
      role: roleInt
        ? Object.keys(userRoleEnum).find(
            (role) => roleInt === userRoleEnum[role].value
          )
        : undefined,
    };
  } catch (error) {
    return error;
  }
};

const login = ({ body: { emailOrUsername, password } }, res) =>
  usersQuery
    .resolve({}, { filter__emailOrUsername: emailOrUsername })
    .then(([{ encrypted_password, ...user } = {}] = []) =>
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

const logout = (req, res, next) => {
  redis.get("1", (err, reply) => {
    console.log("err", err);
    console.log("reply", reply);
  });
};

const refresh = (req, res, next) => {};

module.exports = {
  getUser,
  login,
  logout,
  refresh,
  verifyToken,
};

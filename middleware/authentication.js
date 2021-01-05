require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt-async");
const userRoleEnum = require("../schema/users/roles-enum");
const usersQuery = require("../schema/users/queries/users");

/// Auth
const verifyToken = (req) => {
  return new Promise((resolve, reject) => {
    const auth = req.get("authorization");
    if (typeof auth === "undefined") {
      return resolve();
    }

    const token = auth.split(/^Bearer /)[1];
    if (!token) {
      return reject("Authorization malformed");
    }

    return jwt
      .verify(token, process.env.SECRET_TOKEN)
      .then(({ id }) => redis.get(userToken.id))
      .then(({ id }) => resolve(id))
      .catch(() => reject("Token invalid"));
  });
};

const getUser = (ctx) =>
  verifyToken(ctx.request)
    .then((id) => {
      if (!id) {
        return;
      }

      return usersQuery.resolve({}, { filter__id: id });
    })
    .then(([{ role: roleInt = 0, ...user } = {}] = []) => ({
      ...user,
      role: roleInt
        ? Object.keys(userRoleEnum).find(
            (role) => roleInt === userRoleEnum[role].value
          )
        : undefined,
    }))
    .catch(() => undefined);

const login = ({ body: { emailOrUsername, password } }, res) => {
  if (!emailOrUsername || !password) {
    return res.send({ error: "Login credentials invalid" });
  }

  return usersQuery
    .resolve({}, { filter__emailOrUsername: emailOrUsername })
    .then(([{ encrypted_password, ...user } = {}] = []) =>
      Promise.all([user, bcrypt.compare(password, encrypted_password)])
    )
    .then(([{ id, email, username }, isAuthenticated]) => {
      if (!isAuthenticated) {
        return res.send({ error: "Login credentials invalid" });
      }
      const accessToken = jwt.sign(
        { id, email, username },
        process.env.SECRET_TOKEN,
        {
          expiresIn: "1d",
        }
      );
      return redis
        .set(id, accessToken, "EX", 24 * 60 * 60)
        .then(() =>
          res.json({
            accessToken,
          })
        )
        .catch(() => res.send({ error: "Server error" }));
    });
};

const logout = (req, res,) =>
  verifyToken(req)
    .then((id) =>
      redis
        .del(id)
        .then(() => res.sendStatus(204))
        .catch(() => res.status(500).send({ error: "Server error" }))
    )
    .catch(() => res.sendStatus(204));

const refresh = (req, res, next) => {};

module.exports = {
  getUser,
  login,
  logout,
  refresh,
};

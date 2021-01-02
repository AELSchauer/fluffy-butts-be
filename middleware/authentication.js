/// Auth

const users = {
  mathew: {
    id: 1,
    name: "Mathew",
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

module.exports = {
  getUser
}
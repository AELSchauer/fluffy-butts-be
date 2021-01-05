const { promisify } = require("util");
const redisSync = require("redis").createClient();

module.exports = {
  del: promisify(redisSync.del),
  get: promisify(redisSync.get),
  set: promisify(redisSync.set),
}
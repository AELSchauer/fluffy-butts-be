const { promisify } = require("util");
const redisSync = require("redis").createClient();

module.exports = {
  del: promisify(redisSync.del).bind(redisSync),
  get: promisify(redisSync.get).bind(redisSync),
  set: promisify(redisSync.set).bind(redisSync),
};
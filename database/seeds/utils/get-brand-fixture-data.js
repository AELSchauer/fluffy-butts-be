const fs = require("fs");
const fixtureNames = fs.readdirSync("./database/seeds/fixtures");
module.exports = fixtureNames
  .map(
    (fixtureName) =>
      fixtureName.indexOf("brand-") > -1 &&
      fs.readFileSync(`./database/seeds/fixtures/${fixtureName}`, "utf8")
  )
  .filter(Boolean)
  .map((json) => JSON.parse(json));

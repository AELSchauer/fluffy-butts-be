const fs = require("fs");
const retailerData = JSON.parse(
  fs.readFileSync("./database/seeds/fixtures/retailers.json", "utf8")
);

exports.seed = async function (knex) {
  await knex("retailers").delete();
  await knex("retailers").insert(
    retailerData.map(({ name, url, shipping }) => ({
      name,
      url,
      shipping,
      created_at: new Date(),
    }))
  );
  return;
};

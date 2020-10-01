const fs = require("fs");
const tagData = JSON.parse(
  fs.readFileSync("./database/seeds/fixtures/tags.json", "utf8")
);
const { categoriesEnum } = require("../../schema/tag");

exports.seed = async function (knex) {
  await knex("tags").delete();
  await knex("tags").insert(
    Object.entries(tagData).map(([name, { category, display_order }]) => ({
      name,
      category: categoriesEnum[category].value,
      display_order,
      created_at: new Date(),
    }))
  );
  return;
};

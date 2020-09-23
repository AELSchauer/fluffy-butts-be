const fs = require("fs");
const tagData = JSON.parse(
  fs.readFileSync("./database/seeds/fixtures/tags.json", "utf8")
);
const { categoriesEnum } = require("../../schema/tag");

exports.seed = async function (knex) {
  await knex("tags").delete();
  await knex("tags").insert(
    Object.entries(tagData).map(([name, categoryText]) => ({
      name,
      category: categoriesEnum[categoryText].value,
      created_at: new Date(),
    }))
  );
  return;
};

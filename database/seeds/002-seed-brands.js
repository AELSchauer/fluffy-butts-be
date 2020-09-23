const brandData = require("./utils/get-brand-fixture-data");

exports.seed = async function (knex) {
  await knex("brands").delete();
  await knex("brands").insert(
    brandData.map(({ brand }) => ({
      name: brand,
      name_insensitive: brand.toLowerCase(),
      created_at: new Date(),
    }))
  );
  return;
};

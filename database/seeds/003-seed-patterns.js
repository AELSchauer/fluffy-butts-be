const brands = require("./utils/get-brand-fixture-data");
const { deleteTaggings } = require("./utils/delete-polymorphic-entries");

exports.seed = async function (knex) {
  await knex("patterns").delete();
  await deleteTaggings(knex, "Pattern");

  for (const { brand: brand_name, patterns } of brands) {
    const [{ id: brand_id }] = await knex
      .select("id")
      .table("brands")
      .where({ name: brand_name });

    for (const { name: pattern_name, tags } of patterns) {
      await knex("patterns").insert({
        name: pattern_name,
        brand_id,
        created_at: new Date(),
      });

      const [{ id: pattern_id } = {}] = await knex
        .select("id")
        .table("patterns")
        .where({
          name: pattern_name,
          brand_id,
        });

      for (const tagName of tags) {
        const [{ id: tag_id } = {}] = await knex
          .select("id")
          .table("tags")
          .where({ name: tagName });

        await knex("taggings").insert({
          tag_id,
          taggable_id: pattern_id,
          taggable_type: "Pattern",
          created_at: new Date(),
        });
      }
    }
  }

  return;
};

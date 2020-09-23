const brandData = require("./utils/get-brand-fixture-data");
exports.seed = async function (knex) {
  await knex("patterns").delete();
  await knex("taggings").where({ taggable_type: "Pattern" }).delete();

  const newPatternEntries = [];
  const taggingData = [];
  const newTaggingEntries = [];

  for (let i = 0; i < brandData.length; i++) {
    const { brand, patterns } = brandData[i];
    const [{ id: brand_id }] = await knex
      .select("id")
      .table("brands")
      .where({ name: brand });

    patterns.forEach(({ name, tags }) => {
      newPatternEntries.push({
        name,
        brand_id,
        created_at: new Date(),
      });
      tags.forEach((tagName) => {
        taggingData.push({
          name,
          brand_id,
          tagName,
        });
      });
    });
  }

  await knex("patterns").insert(newPatternEntries);
  const patternEntries = await knex.select().table("patterns");
  const tagEntries = await knex.select().table("tags");

  for (let j = 0; j < taggingData.length; j++) {
    const { tagName, name, brand_id } = taggingData[j];

    const { id: taggable_id } = patternEntries.find(
      (entry) => entry.name === name && entry.brand_id === brand_id
    );

    const { id: tag_id } = tagEntries.find(
      (entry) => entry.name === tagName
    );

    newTaggingEntries.push({
      tag_id,
      taggable_id,
      taggable_type: "Pattern",
      created_at: new Date(),
    });
  }

  await knex("taggings").insert(newTaggingEntries);

  return;
};

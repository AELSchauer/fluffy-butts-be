const _ = require("lodash");
const brandData = require("./utils/get-brand-fixture-data");
const getImageUrl = (name) =>
  `https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/${name.replace(
    / /,
    "%20"
  )}/Logo.png`;

exports.seed = async function (knex) {
  // Delete existing data
  await knex("brands").delete();
  const imageIds = await knex
    .select("image_id")
    .table("imagings")
    .where({ imageable_type: "Brand" });
  imageIds.length &&
    (await knex("images").whereIn("id", _.map(imageIds, "image_id")).delete());
  await knex("imagings").where({ imageable_type: "Brand" }).delete();

  // Seed new data
  await knex("brands").insert(
    brandData.map(({ brand }) => ({
      name: brand,
      name_insensitive: brand.toLowerCase(),
      created_at: new Date(),
    }))
  );

  await knex("images").insert(
    brandData.map(({ brand }) => ({
      url: getImageUrl(brand),
      created_at: new Date(),
    }))
  );

  const brandEntries = await knex.select().table("brands");
  const imageEntries = await knex.select().table("images");

  await knex("imagings").insert(
    brandData.map(({ brand }) => ({
      image_id: imageEntries.find(({ url }) => url ===  getImageUrl(brand)).id,
      imageable_type: "Brand",
      imageable_id: brandEntries.find(({ name }) => name === brand).id,
      created_at: new Date()
    }))
  );

  return;
};

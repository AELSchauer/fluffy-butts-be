const brands = require("./utils/get-brand-fixture-data");
const { getBrandImageUrl } = require("./utils/get-image-url");
const {
  deleteImagesAndImagings,
} = require("./utils/delete-polymorphic-entries");

exports.seed = async function (knex) {
  // Delete existing data
  await knex("brands").delete();
  await deleteImagesAndImagings(knex, "Brand");

  // Seed new data
  for (const { brand: brand_name } of brands) {
    await knex("brands").insert({
      name: brand_name,
      created_at: new Date(),
    });

    await knex("images").insert({
      url: getBrandImageUrl(brand_name),
      created_at: new Date(),
    });

    const [{ id: image_id }] = await knex
      .select("id")
      .table("images")
      .where({ url: getBrandImageUrl(brand_name) });

    const [{ id: brand_id }] = await knex
      .select("id")
      .table("brands")
      .where({ name: brand_name });

    await knex("imagings").insert({
      image_id,
      imageable_type: "Brand",
      imageable_id: brand_id,
      created_at: new Date(),
    });
  }

  return;
};

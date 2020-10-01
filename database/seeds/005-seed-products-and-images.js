const brands = require("./utils/get-brand-fixture-data");
const {
  deleteImagesAndImagings,
} = require("./utils/delete-polymorphic-entries");
const { getProductImageUrl } = require("./utils/get-image-url");

exports.seed = async function (knex) {
  // Delete existing data
  await knex("products").delete();
  await deleteImagesAndImagings(knex, "Product");

  // Seed new data
  for (const { brand: brand_name, product_lines } of brands) {
    const [{ id: brand_id = null } = {}] = await knex
      .select()
      .table("brands")
      .where({ name: brand_name });

    for (const { name: product_line_name, products } of product_lines) {
      const [{ id: product_line_id = null } = {}] = await knex
        .select()
        .table("product_lines")
        .where({ name: product_line_name, brand_id });

      for (const {
        name: product_name,
        pattern: pattern_name,
        details,
      } of products) {
        const [{ id: pattern_id = null } = {}] =
          typeof pattern_name !== "undefined"
            ? await knex
                .select()
                .table("patterns")
                .where({ name: pattern_name })
            : [];

        await knex("products").insert({
          name: product_name,
          details,
          pattern_id,
          product_line_id,
          created_at: new Date(),
        });

        await knex("images").insert({
          url: getProductImageUrl(brand_name, product_line_name, product_name),
          created_at: new Date(),
        });

        const [{ id: product_id = null } = {}] = await knex
          .select()
          .table("products")
          .where({ name: product_name, product_line_id });

        const [{ id: image_id = null } = {}] = await knex
          .select()
          .table("images")
          .where({
            url: getProductImageUrl(
              brand_name,
              product_line_name,
              product_name
            ),
          });

        await knex("imagings").insert({
          image_id,
          imageable_id: product_id,
          imageable_type: "Product",
          created_at: new Date(),
        });
      }
    }
  }

  return;
};

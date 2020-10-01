const brands = require("./utils/get-brand-fixture-data");
const {
  deleteImagesAndImagings,
} = require("./utils/delete-polymorphic-entries");
const { getProductImageUrl } = require("./utils/get-image-url");

exports.seed = async function (knex) {
  // Delete existing data
  await knex("listings").where({ listable_type: "Product" }).delete();

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

      for (const { name: product_name, listings } of products) {
        const [{ id: product_id = null } = {}] = await knex
          .select()
          .table("products")
          .where({ name: product_name, product_line_id });

        for (const {
          countries,
          currency,
          url,
          price,
          sizes,
          retailer: retailer_name,
        } of listings) {
          const [{ id: retailer_id = null } = {}] = await knex
            .select()
            .table("retailers")
            .where({ name: retailer_name });

          await knex("listings").insert({
            countries: !!countries ? JSON.stringify(countries) : null,
            currency,
            url: url || sizes[0].url,
            price,
            sizes: !!sizes ? JSON.stringify(sizes) : null,
            retailer_id,
            listable_id: product_id,
            listable_type: "Product",
            created_at: new Date(),
          });
        }
      }
    }
  }

  return;
};

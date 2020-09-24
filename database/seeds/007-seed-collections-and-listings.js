const brands = require("./utils/get-brand-fixture-data");

exports.seed = async function (knex) {
  // Delete existing data
  await knex("listings").delete();

  // Seed new data
  for (const { product_lines } of brands) {
    for (const { name: product_line_name, collections = [] } of product_lines) {
      const [{ id: product_line_id = null } = {}] = await knex
        .select()
        .table("product_lines")
        .where({ name: product_line_name });

      for (const {
        name: collection_name,
        details = null,
        products: product_names,
        listings,
      } of collections) {
        await knex("collections").insert({
          name: collection_name,
          details,
          product_line_id,
          created_at: new Date(),
        });

        const [{ id: collection_id = null } = {}] = await knex
          .select()
          .table("collections")
          .where({ name: collection_name });

        const product_ids = (
          await knex
            .select()
            .table("products")
            .where("product_line_id", product_line_id)
            .whereIn("name", product_names)
        ).map(({ id }) => id);

        await knex("collection_products").insert(
          product_ids.map((product_id) => ({
            product_id,
            collection_id,
            created_at: new Date(),
          }))
        );

        for (const {
          countries = null,
          currency = null,
          url,
          price = null,
          sizes = null,
          retailer: retailer_name,
        } of listings) {
          const [{ id: retailer_id = null } = {}] = await knex
            .select()
            .table("retailers")
            .where({ name: retailer_name });

          await knex("listings").insert({
            countries: JSON.stringify(countries),
            currency,
            url: url || sizes[0].url,
            price,
            sizes: JSON.stringify(sizes),
            retailer_id,
            listable_id: collection_id,
            listable_type: "Collection",
            created_at: new Date(),
          });
        }
      }
    }
  }

  return;
};

const brands = require("./utils/get-brand-fixture-data");

exports.seed = async function (knex) {
  // Delete existing data
  await knex("collection_products").delete();
  await knex("collections").delete();
  await knex("listings").where({ listable_type: "Collection" }).delete();

  // Seed new data
  for (const { brand: brand_name, product_lines } of brands) {
    const [{ id: brand_id = null } = {}] = await knex
      .select()
      .table("brands")
      .where({ name: brand_name });

    for (const { name: product_line_name, collections = [] } of product_lines) {
      const [{ id: product_line_id = null } = {}] = await knex
        .select()
        .table("product_lines")
        .where({ name: product_line_name, brand_id });

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
          .where({ name: collection_name, product_line_id });

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

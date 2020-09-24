const brands = require("./utils/get-brand-fixture-data");
const { getProductImageUrl } = require("./utils/get-image-url");
const {
  deleteImagesAndImagings,
  deleteTagsAndTaggings,
} = require("./utils/delete-polymorphic-entries");

exports.seed = async function (knex) {
  // Delete existing data
  await knex("product_lines").delete();
  await deleteImagesAndImagings(knex, "ProductLine");
  await deleteTagsAndTaggings(knex, "ProductLine");

  // Seed new data
  for (const { brand: brand_name, product_lines } of brands) {
    const [{ id: brand_id }] = await knex
      .select("id")
      .table("brands")
      .where({ name: brand_name });

    for (const {
      name: product_line_name,
      sort_order,
      details,
      products,
      tags = [],
    } of product_lines) {
      await knex("product_lines").insert({
        brand_id,
        name: product_line_name,
        display_order: sort_order,
        details,
        created_at: new Date(),
      });

      const [{ id: product_line_id }] = await knex
        .select("id")
        .table("product_lines")
        .where({ brand_id, name: product_line_name });

      for (const tagName of tags) {
        const [{ id: tag_id }] = await knex.select("id").table("tags").where({
          name: tagName,
        });

        await knex("taggings").insert({
          tag_id,
          taggable_id: product_line_id,
          taggable_type: "ProductLine",
          created_at: new Date(),
        });
      }

      const { name: product_name } = products.find(
        ({ default: isDefault }) => !!isDefault
      );

      if (!!product_name) {
        await knex("images").insert({
          url: getProductImageUrl(brand_name, product_line_name, product_name),
          created_at: new Date(),
        });

        const [{ id: image_id }] = await knex
          .select("id")
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
          imageable_id: product_line_id,
          imageable_type: "ProductLine",
          created_at: new Date(),
        });
      }
    }
  }

  return;
};

const _ = require('lodash')
const brandData = require("./utils/get-brand-fixture-data");
const getImageUrl = (brand_name, product_line_name, product_name) =>
  `https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/${brand_name.replace(
    / /g,
    "+"
  )}/${product_line_name.replace(/ /g, "+")}/Products/${product_name
    .replace(/ /g, "+")
    .replace(/'/g, "")}.jpg`;

exports.seed = async function (knex) {
  // Delete existing data
  await knex("products").delete();
  const imageIds = await knex
    .select("image_id")
    .table("imagings")
    .where({ imageable_type: "Product" });
  imageIds.length &&
    (await knex("images").whereIn("id", _.map(imageIds, "image_id")).delete());
  await knex("imagings").where({ imageable_type: "Product" }).delete();

  // Seed new data
  const patternEntries = await knex.select().table("patterns");
  const productLineEntries = await knex.select().table("product_lines");

  let newImageEntries = [];
  let newImagingEntries = [];
  let pseudoImagingEntries = [];
  let newProductEntries = [];
  brandData.forEach(({ brand, product_lines }) => {
    product_lines.forEach(({ name: product_line_name, products }) => {
      products.forEach(
        ({
          name: product_name,
          pattern,
          details,
          default: isDefaultImage = false,
        }) => {
          const [{ id: pattern_id = null } = {}] =
            pattern !== null &&
            patternEntries.filter(({ name }) => name === pattern);
          const [
            { id: product_line_id = null } = {},
          ] = productLineEntries.filter(
            ({ name }) => name === product_line_name
          );

          newProductEntries.push({
            name: product_name,
            details,
            pattern_id,
            product_line_id,
            created_at: new Date(),
          });

          newImageEntries.push({
            url: getImageUrl(brand, product_line_name, product_name),
            created_at: new Date(),
          });

          isDefaultImage &&
            newImagingEntries.push({
              url: getImageUrl(brand, product_line_name, product_name),
              imageable_id: product_line_id,
              imageable_type: "ProductLine",
            });

          pseudoImagingEntries.push({
            url: getImageUrl(brand, product_line_name, product_name),
            product_name,
            product_line_id,
          });
        }
      );
    });
  });

  await knex("products").insert(newProductEntries);
  await knex("images").insert(newImageEntries);

  const productEntries = await knex.select().table("products");
  const imageEntries = await knex.select().table("images");
  newImagingEntries = newImagingEntries
    .concat(
      pseudoImagingEntries.map(({ url, product_name, product_line_id }) => ({
        url,
        imageable_type: "Product",
        imageable_id: productEntries.find(
          (productEntry) =>
            productEntry.name === product_name &&
            productEntry.product_line_id == product_line_id
        ).id,
      }))
    )
    .map(({ url, ...imageable }) => ({
      image_id: imageEntries.find((imageEntry) => imageEntry.url === url).id,
      ...imageable,
      created_at: new Date(),
    }));

  await knex("imagings").insert(newImagingEntries);

  return;
};

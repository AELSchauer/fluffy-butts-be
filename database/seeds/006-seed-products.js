const brandData = require("./utils/get-brand-fixture-data");

exports.seed = async function (knex) {
  await knex("products").delete();

  const patternEntries = await knex.select().table("patterns");
  const productLineEntries = await knex.select().table("product_lines");

  const newImageEntries = [];
  const newImagingEntries = [];
  const newProductEntries = [];
  brandData.forEach(({ brand, product_lines }) => {
    product_lines.forEach(({ name: product_line_name, products }) => {
      products.forEach(({ name: product_name, pattern, details, default }) => {
        const [{ id: pattern_id = null } = {}] =
          typeof pattern !== "undefined" &&
          patternEntries.filter(({ name }) => name === pattern);
        const [{ id: product_line_id = null } = {}] = productLineEntries.filter(
          ({ name }) => name === product_line_name
        );
        newProductEntries.push({
          name: product_name,
          details,
          pattern_id,
          product_line_id,
          created_at: new Date(),
        });
      });
    });
  });

  await knex("products").insert(newProductEntries);

  return;
};

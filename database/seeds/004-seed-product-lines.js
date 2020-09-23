const brandData = require("./utils/get-brand-fixture-data");

exports.seed = async function (knex) {
  await knex("product_lines").delete();
  
  const brandEntries = await knex.select().table("brands");
  await knex("product_lines").insert(
    brandData.reduce((woot, { brand, product_lines }) => {
      const { id: brand_id } = brandEntries.find(({ name }) => name === brand);
      return woot.concat(
        product_lines.map(({ name, sort_order, details }) => ({
          name,
          display_order: sort_order,
          details,
          brand_id,
        }))
      );
    }, [])
  );

  return;
};

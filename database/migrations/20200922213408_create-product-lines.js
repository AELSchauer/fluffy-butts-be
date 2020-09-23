exports.up = function (knex) {
  return knex.schema
    .createTable("product_lines", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.string("display_order").notNullable();
      table.jsonb("details");

      table.integer("brand_id").unsigned().notNullable();
      table.foreign("brand_id").references("brands.id");
      table.index("brand_id", "index_product_lines_on_brand_id");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "005-seed-product-lines.js" }));
};

exports.down = function (knex) {
  return knex.schema.dropTable("product_lines");
};

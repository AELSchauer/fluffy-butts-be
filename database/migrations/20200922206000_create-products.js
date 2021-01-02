exports.up = function (knex) {
  return knex.schema
    .createTable("products", function (table) {
      table. bigIncrements("id");
      table.string("name").notNullable();
      table.jsonb("details");

      table.integer("pattern_id").unsigned();
      table.foreign("pattern_id").references("patterns.id");
      table.index("pattern_id", "index_products_on_pattern_id");

      table.integer("product_line_id").unsigned().notNullable();
      table.foreign("product_line_id").references("product_lines.id");
      table.index("product_line_id", "index_products_on_product_line_id");

      table.timestamps();

      table.unique(["name", "product_line_id"]);
    })
    .then(() => knex.seed.run({ specific: "005-seed-products-and-images.js" }));
};

exports.down = function (knex) {
  return knex.schema.dropTable("products");
};

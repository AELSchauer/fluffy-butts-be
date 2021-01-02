exports.up = function (knex) {
  return knex.schema
    .createTable("bulk_packs", function (table) {
      table. bigIncrements("id");
      table.string("name").notNullable();
      table.integer("quantity");

      table.integer("product_line_id").unsigned().notNullable();
      table.foreign("product_line_id").references("product_lines.id");
      table.index("product_line_id", "index_bulk_packs_on_product_line_id");

      table.timestamps();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bulk_packs");
};

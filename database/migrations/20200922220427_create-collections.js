exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("collections", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.jsonb("details");

      table.integer("product_line_id").unsigned().notNullable();
      table.foreign("product_line_id").references("product_lines.id");
      table.index("product_line_id", "index_collections_on_product_line_id");

      table.timestamps();
    }),

    knex.schema.createTable("collection_products", function (table) {
      table.increments("id");

      table.integer("collection_id").unsigned().notNullable();
      table.foreign("collection_id").references("collections.id");
      table.index(
        "collection_id",
        "index_collection_products_on_collection_id"
      );

      table.integer("product_id").unsigned().notNullable();
      table.foreign("product_id").references("products.id");
      table.index("product_id", "index_collection_products_on_product_id");

      table.timestamps();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("collection_products"),
    knex.schema.dropTable("collections"),
  ]);
};
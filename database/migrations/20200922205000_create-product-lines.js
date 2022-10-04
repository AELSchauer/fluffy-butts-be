exports.up = function (knex) {
  return knex.schema
    .createTable("product_lines", function (table) {
      table. bigIncrements("id");
      table.string("name").notNullable();
      table.string("display_order").notNullable();
      table.jsonb("details");

      table.integer("brand_id").unsigned().notNullable();
      table.foreign("brand_id").references("brands.id").onDelete("CASCADE");
      table.index("brand_id", "index_product_lines_on_brand_id");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "004-seed-product-lines-and-images.js" }))
    .then(() => console.log("product lines done!"));
};

exports.down = function (knex) {
  return knex.schema.dropTable("product_lines");
};

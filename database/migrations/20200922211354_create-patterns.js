exports.up = function (knex) {
  return knex.schema
    .createTable("patterns", function (table) {
      table.increments("id");
      table.string("name").notNullable();

      table.integer("brand_id").unsigned().notNullable();
      table.foreign("brand_id").references("brands.id");
      table.index("brand_id", "index_patterns_on_brand_id");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "004-seed-patterns.js" }));
};

exports.down = function (knex) {
  return knex.schema.dropTable("patterns");
};

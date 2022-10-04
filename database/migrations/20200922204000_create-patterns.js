exports.up = function (knex) {
  return knex.schema
    .createTable("patterns", function (table) {
      table. bigIncrements("id");
      table.string("name").notNullable();

      table.integer("brand_id").unsigned().notNullable();
      table.foreign("brand_id").references("brands.id");
      table.index("brand_id", "index_patterns_on_brand_id");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "003-seed-patterns.js" }))
    .then(() => console.log("patterns done!"));
};

exports.down = function (knex) {
  return knex.schema.dropTable("patterns");
};

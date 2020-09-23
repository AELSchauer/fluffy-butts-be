exports.up = function(knex) {
  return knex.schema
    .createTable("brands", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.string("name_insensitive").notNullable();
      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "002-seed-brands.js" }));
};

exports.down = function(knex) {
  return knex.schema.dropTable("brands");
};

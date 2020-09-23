exports.up = function(knex) {
  return knex.schema.createTable("brands", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.string("name_insensitive").notNullable();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("brands");
};

exports.up = function (knex) {
  return knex.schema.createTable("retailers", function (table) {
    table.increments("id");
    table.string("name").notNullable();
    table.string("url").notNullable();
    table.jsonb("shipping");

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("retailers");
};

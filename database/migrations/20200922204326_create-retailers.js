exports.up = function (knex) {
  return knex.schema
    .createTable("retailers", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.string("url").notNullable();
      table.jsonb("shipping");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "002-seed-retailers.js" }));
};

exports.down = function (knex) {
  return knex.schema.dropTable("retailers");
};

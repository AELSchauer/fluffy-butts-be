exports.up = function (knex) {
  return knex.schema
    .createTable("retailers", function (table) {
      table. bigIncrements("id");
      table.string("name").notNullable();
      table.string("url").notNullable();
      table.jsonb("shipping");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "001-seed-retailers.js" }))
    .then(() => console.log("retailers done!"));
};

exports.down = function (knex) {
  return knex.schema.dropTable("retailers");
};

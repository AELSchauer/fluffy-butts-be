exports.up = function (knex) {
  return knex.schema
    .createTable("brands", function (table) {
      table.bigIncrements("id");
      table.string("name").notNullable();
      table.timestamps();

      table.unique("name");
    })
    .then(() => knex.seed.run({ specific: "002-seed-brands-and-images.js" }))
    .then(() => console.log("brands done!"));
};

exports.down = function (knex) {
  return knex.schema.dropTable("brands");
};

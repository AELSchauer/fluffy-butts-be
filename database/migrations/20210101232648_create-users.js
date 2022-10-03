exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.bigIncrements("id");
      table.string("username").notNullable().unique();
      table.string("email").notNullable().unique();
      table.integer("role").notNullable().defaultTo(0);
      table.string("encrypted_password");

      table.index("email", "index_users_on_email");
      table.index("username", "index_users_on_username");

      table.timestamps();
    })
    .then(() => knex.seed.run({ specific: "008-seed-users.js" }));
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

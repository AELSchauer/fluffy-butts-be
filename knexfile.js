const { FsMigrations } = require("knex/lib/migrate/sources/fs-migrations");

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "fluffy-butts_development",
      host: "localhost",
      password: null,
      port: 5432,
      user: "ashleyschauer",
    },
    migrations: {
      tableName: "migrations",
      migrationSource: new FsMigrations("./database/migrations", false),
    },
    seeds: {
      directory: "./database/seeds",
    },
  },

  // staging: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password",
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password",
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },
};

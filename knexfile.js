const { FsMigrations } = require("knex/lib/migrate/sources/fs-migrations");
require("dotenv").config({ path: "./.staging.env" });
console.log(process.env);

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
  staging: {
    client: "pg",
    connection: {
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      ssl: true,
      dialectOptions: {
        ssl: true,
      },
    },
    migrations: {
      tableName: "migrations",
      migrationSource: __dirname + "./database/migrations",
    },
    seeds: {
      directory: __dirname + "./database/seeds",
    },
  },

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

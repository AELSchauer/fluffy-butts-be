require('dotenv').config();
const environment =
  process.env.NODE_ENV === "production"
    ? "PROD"
    : process.env.NODE_ENV === "test"
    ? "TEST"
    : "DEV";

module.exports = {
  db: {
    host: process.env[`${environment}_DB_PGHOST`],
    user: process.env[`${environment}_DB_PGUSER`],
    database: process.env[`${environment}_DB_PGDATABASE`],
    password: process.env[`${environment}_DB_PGPASSWORD`],
    port: process.env[`${environment}_DB_PGPORT`],
  },
};

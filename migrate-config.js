require("dotenv").config({ path: ".env.development" });

module.exports = {
  database: {
    host: "localhost",
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  migrations: {
    dir: "migrations",
    table: "pgmigrations",
  },
};

const pgp = require('pg-promise')();

const connString = process.env.KNOW_YOUR_FUNGI_DB_URI ||
                   "postgres://localhost/know_your_fungi";

module.exports = {
  pgp: pgp,
  db: pgp(connString)
};

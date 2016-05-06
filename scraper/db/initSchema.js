const conn = require('./connection');

const deleteString = `DROP TABLE IF EXISTS raw_data CASCADE;`;
const createString = `CREATE TABLE raw_data (id uuid PRIMARY KEY, kingdom text,
  division text, class text, taxonomic_order text, family text, genus text, species text,
  first_paragraph text, image_source text);`;

const deleteTable = (t) => { return t.none(deleteString) };
const createTable = (t) => { return t.none(createString) };

conn.db.task(deleteTable)
  .then(() => conn.db.task(createTable))
  .then(() => {
    console.log('raw_data reset');
    conn.pgp.end();
  })
  .catch(err => {
    console.log(err);
    conn.pgp.end();
  });

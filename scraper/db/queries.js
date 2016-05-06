const uuid = require('node-uuid');
const camelize = require('camelize');
const conn = require('./connection');

let queries = {};
module.exports = queries;

queries.insertRawData = function(obj) {
  /* @param { Object : String } data fields to be inserted in db
     @return { Object : Promise } */

  obj['id'] = uuid.v4();

  const fields = [
    'id', 'kingdom', 'division', 'class', 'taxonomic_order', 'family', 'genus',
    'species', 'first_paragraph', 'image_source'
  ];

  const str = `
    INSERT INTO raw_data
    (${fields.join(', ')})
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `;

  const values = camelize(fields).map(field => {
    return defaultToEmpty(obj[field]);
  });

  return conn.db.task(t => {
    return t.none(str, values);
  });
}

function defaultToEmpty(data) {
  /*  @param { String | undefined }
      @return { String } */

  return data || '';
}

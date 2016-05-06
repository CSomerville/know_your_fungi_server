const uuid = require('node-uuid');
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

  const values = fields.map(camelize).map(field => {
    if (field === 'taxonomicOrder') return defaultToEmpty(obj['order']);
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

function camelize(str) {
  /* @param { String } snakeCased
     @return { String } camelized
     quick and dirty--sorry! */
  return str.split('_').map((subStr, i) => {
    return (i > 0) ? subStr.slice(0,1).toUpperCase() + subStr.slice(1) : subStr;
  }).join('');
}

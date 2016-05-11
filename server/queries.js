const connection = require('../scraper/db/connection');

const queries = {};
module.exports = queries;

queries.getFungi = function() {
  return connection.db.task(t => {
    return t.many(`
        WITH division_ids AS (
          SELECT id FROM divisions
        )
        SELECT *, (
          SELECT COALESCE(json_agg(c), '[]')
          FROM (
            SELECT id, class FROM classes
            WHERE division_id IN (SELECT * FROM division_ids)
          ) c
        ) AS classes FROM divisions;
      `);
  });
}

queries.getSpecies = function(id) {
  return connection.db.task(t => {
    return t.any(`
        SELECT * FROM SPECIES WHERE id = $1;
      `, [id]);
  })
}

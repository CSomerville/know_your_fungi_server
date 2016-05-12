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

queries.getTaxonomicLevel = function(id, level) {
  /*  @param { String } uuid
      @param { Integer } 0 <= x <= 3
      @return { Promise } */

  const classificationKeys = [
    { sing: 'division', plural: 'divisions' },
    { sing: 'class', plural: 'classes' },
    { sing: 'taxonomic_order', plural: 'taxonomic_orders' },
    { sing: 'family', plural: 'families' },
    { sing: 'genus', plural: 'genuses' },
    { sing: 'species', plural: 'species' }
  ];

  let parent;
  if (level > 0) parent = classificationKeys[level-1].sing;
  const currentSing = classificationKeys[level].sing;
  const currentPlural = classificationKeys[level].plural;
  const childSing = classificationKeys[level+1].sing;
  const childPlural = classificationKeys[level+1].plural;
  const grandchildPlural = classificationKeys[level+2].plural;

  return connection.db.task(t => {
    return Promise.all([
      (level > 0)
      ?
      t.any(`
        SELECT * FROM ${currentPlural} WHERE
        ${parent}_id=(
          SELECT ${parent}_id FROM ${currentPlural} WHERE id=$1
        );`, [id])
      :
      t.any(`SELECT * FROM divisions;`),
      t.any(`SELECT * FROM ${childPlural} WHERE ${currentSing}_id=$1`, [id]),
      t.any(`
        SELECT * FROM ${grandchildPlural} WHERE
          ${childSing}_id IN (
            SELECT id FROM ${childPlural} WHERE ${currentSing}_id=$1
          );`, [id])
    ]);
  });
}

queries.getSpecies = function(id) {
  return connection.db.task(t => {
    return t.any(`
        SELECT * FROM SPECIES WHERE id = $1;
      `, [id]);
  })
}

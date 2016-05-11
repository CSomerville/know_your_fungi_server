const uuid = require('node-uuid');
const connection = require('./connection');

const deleteStrings = [
  `DROP TABLE IF EXISTS divisions CASCADE;`,
  `DROP TABLE IF EXISTS classes CASCADE;`,
  `DROP TABLE IF EXISTS taxonomic_orders CASCADE;`,
  `DROP TABLE IF EXISTS families CASCADE;`,
  `DROP TABLE IF EXISTS genuses CASCADE;`,
  `DROP TABLE IF EXISTS species CASCADE;`
];

const createStrings = [
  `CREATE TABLE divisions (id uuid PRIMARY KEY, division text);`,
  `CREATE TABLE classes
    (id uuid PRIMARY KEY, division_id uuid REFERENCES divisions(id), class text);`,
  `CREATE TABLE taxonomic_orders
    (id uuid PRIMARY KEY, class_id uuid REFERENCES classes(id), taxonomic_order text);`,
  `CREATE TABLE families
    (id uuid PRIMARY KEY, taxonomic_order_id uuid REFERENCES taxonomic_orders(id), family text);`,
  `CREATE TABLE genuses
    (id uuid PRIMARY KEY, family_id uuid REFERENCES families(id), genus text);`,
  `CREATE TABLE species
    (id uuid PRIMARY KEY, genus_id uuid REFERENCES genuses(id), species text,
    image_source text, first_paragraph text);`,
];

const runDelete = (t) => {
  return Promise.all(deleteStrings.map(str => {
    return t.none(str);
  }));
}

const runCreate = (t) => {
  return Promise.all(createStrings.map(str => {
    return t.none(str);
  }));
}

const addDivisions = (t) => {
  const str = `INSERT INTO divisions (id, division) VALUES ($1, $2);`

  return t.many(`SELECT DISTINCT division FROM raw_data WHERE NOT division = '';`)
    .then(data => {
      return Promise.all(data.map(el => {
        return t.none(str, [uuid.v4(), el.division]);
      }));
    });
}

const addTaxonomicLevel = (opts) => {

  let formattedParent = {};

  const str = `
    INSERT INTO ${opts.currentPlural}
    (id, ${opts.parent}_id, ${opts.current})
    VALUES ($1, $2, $3);
  `;

  const speciesStr = `
    INSERT INTO species (id, genus_id, species, first_paragraph, image_source)
    VALUES ($1, $2, $3, $4, $5);
  `;

  return connection.db.task(t => {
    return t.many(`SELECT * FROM ${opts.parentPlural};`)
      .then(parentData => {
        parentData.forEach(el => {
          formattedParent[el[opts.parent]] = el.id;
        });
        return t.many(`SELECT DISTINCT * FROM raw_data WHERE NOT ${opts.current}='' AND NOT ${opts.parent}='';`)
      })
      .then(data => {

        if (opts.current === 'species') { // different query for species table

          return Promise.all(data.map(el => {
            return t.none(speciesStr,
              [uuid.v4(), formattedParent[el[opts.parent]],
              el[opts.current], el.first_paragraph, el.image_source]);
          }));
        } else {

          return Promise.all(data.map(el => {
            return t.none(str, [uuid.v4(), formattedParent[el[opts.parent]], el[opts.current]]);
          }));
        }
      });
  })
}

connection.db.task(runDelete)
  .then(() => connection.db.task(runCreate))
  .then(() => connection.db.task(addDivisions))
  .then(() => addTaxonomicLevel({
    current: 'class',
    currentPlural: 'classes',
    parent: 'division',
    parentPlural: 'divisions'
  }))
  .then(() => addTaxonomicLevel({
    current: 'taxonomic_order',
    currentPlural: 'taxonomic_orders',
    parent: 'class',
    parentPlural: 'classes'
  }))
  .then(() => addTaxonomicLevel({
    current: 'family',
    currentPlural: 'families',
    parent: 'taxonomic_order',
    parentPlural: 'taxonomic_orders'
  }))
  .then(() => addTaxonomicLevel({
    current: 'genus',
    currentPlural: 'genuses',
    parent: 'family',
    parentPlural: 'families'
  }))
  .then(() => addTaxonomicLevel({
    current: 'species',
    currentPlural: 'species',
    parent: 'genus',
    parentPlural: 'genuses'
  }))
  .then(() => {
    console.log('so far so good');
    connection.pgp.end();
  })
  .catch(err => {
    console.log(err);
    connection.pgp.end();
  });

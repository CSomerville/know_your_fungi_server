const uuid = require('node-uuid');
const conn = require('./connection');

let queries = {};
module.exports = queries;

function defaultToEmpty(value) {
    return value || '';
}

function defaultSpecial() {
    return this.order || '';
}

function col(name, prop, init) {
    return {
        name: name,
        prop: prop || name,
        init: init || defaultToEmpty
    };
}

var cs = new conn.pgp.helpers.ColumnSet([
    col('id'), col('kingdom'), col('division'), col('class'), col('family'), col('genus'), col('species'),
    col('taxonomic_order', 'taxonomicOrder', defaultSpecial),
    col('first_paragraph', 'firstParagraph'),
    col('image_source', 'imageSource')],
    {table: 'raw_data'});

queries.insertRawData = function (obj) {
    /* @param { Object : String } data fields to be inserted in db
     @return { Object : Promise } */

    obj['id'] = uuid.v4();

    var query = conn.pgp.helpers.insert(obj, cs);

    return conn.db.none(query);
};

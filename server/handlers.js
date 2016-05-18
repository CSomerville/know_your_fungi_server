const queries = require('./queries');

const handlers = {};
module.exports = handlers;

handlers.getFungi = function(req, res) {
  queries.getFungi()
    .then(data => res.send({
      divisions: data[0],
      classes: data[1]
    }))
    .catch(err => res.sendStatus(500));
}

handlers.getDivision = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 0)
    .then(data => res.send({
      divisions: data[0],
      classes: data[1],
      orders: data[2]
    }))
    .catch(err => { res.sendStatus(500) });
}

handlers.getClass = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 1)
    .then(data => res.send({
      classes: data[0],
      orders: data[1],
      families: data[2]
    }))
    .catch(err => { console.log(err); res.sendStatus(500) });
}

handlers.getOrder = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 2)
    .then(data => res.send({
      orders: data[0],
      families: data[1],
      genuses: data[2]
    }))
    .catch(err => { res.sendStatus(500) });
}

handlers.getFamily = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 3)
    .then(data => res.send({
      families: data[0],
      genuses: data[1],
      species: data[2]
    }))
    .catch(err => { res.sendStatus(500) });
}

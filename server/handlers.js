const queries = require('./queries');

const handlers = {};
module.exports = handlers;

handlers.getFungi = function(req, res) {
  queries.getFungi()
    .then(data => res.send(data))
    .catch(err => res.sendStatus(500));
}

handlers.getDivision = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 0)
    .then(data => res.send(data))
    .catch(err => { res.sendStatus(500) });
}

handlers.getClass = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 1)
    .then(data => res.send(data))
    .catch(err => { console.log(err); res.sendStatus(500) });
}

handlers.getOrder = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 2)
    .then(data => res.send(data))
    .catch(err => { res.sendStatus(500) });
}

handlers.getFamily = function(req, res) {
  queries.getTaxonomicLevel(req.params.id, 3)
    .then(data => res.send(data))
    .catch(err => { res.sendStatus(500) });
}

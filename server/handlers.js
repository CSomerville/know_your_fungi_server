const queries = require('./queries');

const handlers = {};
module.exports = handlers;

handlers.getFungi = function(req, res) {
  queries.getFungi()
    .then(data => res.send(data))
    .catch(err => res.sendStatus(500));
}

handlers.getSpecies = function(req, res) {
  queries.getSpecies(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.sendStatus(500));
}

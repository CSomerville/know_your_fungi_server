const queries = require('./queries');

const handlers = {};
module.exports = handlers;

handlers.getFungi = function(req, res) {
  queries.getFungi()
    .then(data => res.send(data))
    .catch(err => res.sendStatus(500));
}

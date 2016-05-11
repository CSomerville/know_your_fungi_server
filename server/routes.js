const express = require('express');
const bodyParser = require('body-parser');

const api = express.Router();

api.use(bodyParser.json());

api.get('/', function(req, res) {
  res.send({hello: 'world'});
})

module.exports = api;

const express = require('express');
const bodyParser = require('body-parser');
const handlers = require('./handlers');

const api = express.Router();

api.use(bodyParser.json());

api.get('/fungi', handlers.getFungi);
api.get('/species/:id', handlers.getSpecies);

module.exports = api;

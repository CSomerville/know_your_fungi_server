const express = require('express');
const bodyParser = require('body-parser');
const handlers = require('./handlers');

const api = express.Router();

api.use(bodyParser.json());

api.get('/fungi', handlers.getFungi);
api.get('/divisions/:id', handlers.getDivision);
api.get('/classes/:id', handlers.getClass);
api.get('/orders/:id', handlers.getOrder);
api.get('/families/:id', handlers.getFamily);

module.exports = api;

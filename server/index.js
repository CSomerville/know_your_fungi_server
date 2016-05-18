const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const api = require('./routes');

const port = process.env.KNOW_YOUR_FUNGI_PORT || 3000;

const app = express();

app.set('port', port);
app.use(helmet());
app.use(morgan('dev'));

if (process.env.NODE_ENV !== 'production') {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}
app.use('/api', api);

app.listen(app.get('port'), function() {
  console.log(`server listening on ${app.get('port')}`)
});

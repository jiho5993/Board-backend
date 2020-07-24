var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * router api
 */
var apiRouter = require('./router/api_article');

/**
 * router path
 */
app.use('/api', cors(), apiRouter);

app.listen(port, () => {
  console.log("Server on http://localhost:" + port);
})
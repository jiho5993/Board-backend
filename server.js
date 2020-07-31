var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3000;

/**
 * middleware
 */
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * router api
 * article: /api/article/*
 * auth: /api/auth/*
 */
var api = require('./api/index');
app.use('/api', api);

/**
 * error status(404, 500)
 */
app.use((req, res, next) => {
  res.status(404).send('일치하는 주소가 없습니다.');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 에러.');
});

app.listen(port, () => {
  console.log("Server on http://localhost:" + port);
});
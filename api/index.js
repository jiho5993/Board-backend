var express = require('express');
var router = express.Router();
var article = require('./article/article.index');
var auth = require('./auth/auth.index');

router.use('/article', article);
router.use('/auth', auth);

module.exports = router;
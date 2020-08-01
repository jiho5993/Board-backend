var express = require('express');
var router = express.Router();
var article = require('./api/article/article.index');
var auth = require('./api/auth/auth.index');

router.use('/article', article);
router.use('/auth', auth);

module.exports = router;
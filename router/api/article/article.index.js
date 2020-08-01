var express = require('express');
var router = express.Router();
const { getList, getArticle, writeArticle, modifyArticle, deleteArticle } = require('./article.controller');

router.get('/list', getList);
router.get('/read/:id', getArticle);
router.post('/write', writeArticle);
router.put('/modify/:id', modifyArticle);
router.delete('/delete/:id', deleteArticle);

module.exports = router;
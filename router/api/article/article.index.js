var express = require("express");
var router = express.Router();
const article = require("./article.controller");

router.get("/list", article.getList);
router.get("/read/:id", article.getArticle);
router.post("/write", article.writeArticle);
router.put("/modify/:id", article.modifyArticle);
router.delete("/delete/:id", article.deleteArticle);
router.get("/search", article.search);

module.exports = router;

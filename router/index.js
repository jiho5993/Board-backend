var express = require("express");
var router = express.Router();
var article = require("./api/article/article.index");
var auth = require("./api/auth/auth.index");
var reply = require("./api/reply/reply.index");

router.use("/article", article);
router.use("/auth", auth);
router.use("/reply", reply);

module.exports = router;

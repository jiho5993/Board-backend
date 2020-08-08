var express = require("express");
var router = express.Router();
const { write, list } = require("./reply.controller");

router.post("/write", write);
router.get("/list/:id", list);

module.exports = router;

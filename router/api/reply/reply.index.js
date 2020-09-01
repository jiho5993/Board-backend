var express = require("express");
var router = express.Router();
const { write, list, deleteReply, modifyReply } = require("./reply.controller");

router.post("/write", write);
router.get("/list/:id", list);
router.delete("/delete/:id", deleteReply);
router.put("/modify", modifyReply);

module.exports = router;

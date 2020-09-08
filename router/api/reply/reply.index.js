var express = require("express");
var router = express.Router();
const { write, list, deleteReply, modifyReply, getOneReply } = require("./reply.controller");

router.post("/write", write);
router.get("/list/:id", list);
router.delete("/delete/:id", deleteReply);
router.put("/modify", modifyReply);
router.get("/get_reply/:id", getOneReply);

module.exports = router;

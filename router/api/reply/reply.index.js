var express = require("express");
var router = express.Router();
const controller = require("./reply.controller");

router.post("/write", controller.write);
router.get("/list/:id", controller.list);
router.delete("/delete/:id", controller.deleteReply);
router.put("/modify", controller.modifyReply);
router.get("/get_reply/:id", controller.getOneReply);

module.exports = router;

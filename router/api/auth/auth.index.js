var express = require("express");
var router = express.Router();
var authMiddleware = require("../../../middleware/auth");
var controller = require("./auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

router.use("/check", authMiddleware);
router.get("/check", controller.check);

module.exports = router;

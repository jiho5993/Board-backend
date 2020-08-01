var express = require('express');
var router = express.Router();
var authMiddleware = require('../../../middleware/auth');
var { register, login, check } = require('./auth.controller');

router.post('/register', register);
router.post('/login', login);

router.use('/check', authMiddleware);
router.get('/check', check);

module.exports = router;
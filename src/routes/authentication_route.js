const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authentication_controller');


router.post('/api/tenno/register', register);
router.post('/api/tenno/login', login);

module.exports = router;
const express = require('express');
const services = require('../services/auth.services');

const router = express.Router();
const controller = require('../controllers/user.controller');

router.post('/', controller.registerNewUser);
router.post('/admin', services.authorize, controller.registerNewAdmin);

module.exports = router;
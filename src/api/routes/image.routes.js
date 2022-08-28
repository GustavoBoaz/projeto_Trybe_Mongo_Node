const express = require('express');

const router = express.Router();
const controller = require('../controllers/image.controller');

router.get('/:id', controller.imageView);

module.exports = router;
const express = require('express');
const multer = require('multer');

const controller = require('../controllers/recipe.controller');
const services = require('../services/auth.services');

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'src/uploads/',
    filename: (req, file, cb) => {
        cb(null, req.params.id.concat('.jpg'));
    },
});
const upload = multer({ storage });

router.post('/', services.authorize, controller.createNewRecipe);
router.get('/', controller.listRecipes);
router.get('/:id', controller.findRecipeById);
router.put('/:id', services.authorize, controller.updateRecipe);
router.put('/:id/image', services.authorize, upload.single('image'), controller.uploadImage);
router.delete('/:id', services.authorize, controller.deleteRecipe);

module.exports = router;
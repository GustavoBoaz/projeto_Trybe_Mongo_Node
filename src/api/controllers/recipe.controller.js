const recipeServices = require('../services/recipe.services');
const authServices = require('../services/auth.services');

function isValidFields(name, ingredients, preparation) {
    if (!name || !ingredients || !preparation) {
        return false;
    }
    return true;
}

exports.createNewRecipe = async function createNewRecipe(req, res) {
    const { name, ingredients, preparation } = req.body;
    const data = authServices.decodeToken(req.headers.authorization);

    if (!isValidFields(name, ingredients, preparation)) {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }
    
    try {
        return res.status(201).send({ 
            recipe: await recipeServices.createRecipe({
                name: req.body.name,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                userId: data.id,
            }),
        });
    } catch (error) { res.status(500).send({ message: 'Internal error createNewRecipe!.' }); }
};

exports.listRecipes = async function listRecipes(req, res) {
    try {
        return res.status(200).send(await recipeServices.listRecipes({}));
    } catch (error) { res.status(500).send({ message: 'Internal error listRecipes!.' }); }
};

exports.findRecipeById = async function findRecipeById(req, res) {
    try {
        const recipe = await recipeServices.findRecipeById(req.params.id);
        return res.status(200).send(recipe);                 
    } catch (error) { res.status(404).send({ message: 'recipe not found' }); }
};

exports.updateRecipe = async function updateRecipe(req, res) {
    const { name, ingredients, preparation } = req.body;
    if (!isValidFields(name, ingredients, preparation)) {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }
    
    try {
        await recipeServices.updateRecipe(req.params.id, req.body);

        return res.status(200).send(await recipeServices.findRecipeById(req.params.id));
    } catch (error) { res.status(404).send({ message: 'recipe not found' }); }
};

exports.deleteRecipe = async function deleteRecipe(req, res) {
    try {
        await recipeServices.deleteRecipe(req.params.id);

        return res.status(204).send();
    } catch (error) { res.status(404).send({ message: 'recipe not found' }); }
};

exports.uploadImage = async function uploadImage(req, res) {
    try {
        if (req.headers.authorization === undefined) {
            return res.status(401).send({ message: 'missing auth token' });
        }
        const urlString = 'localhost:3000/src/uploads/'.concat(req.params.id).concat('.jpeg');
        await recipeServices.updateImageRecipe(req.params.id, urlString);
        return res.status(200).send(await recipeServices.findRecipeById(req.params.id));
    } catch (error) { res.status(404).send({ message: 'recipe not found' }); }
};
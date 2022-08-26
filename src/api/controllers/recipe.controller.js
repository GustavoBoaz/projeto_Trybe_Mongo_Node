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
    const { id } = req.params.id;
    try {
        const recipe = await recipeServices.findRecipeById({ id });

        if (!recipe) {
            return res.status(404).send({ message: 'recipe not found' });
        }

        return res.status(200).send(recipe);
    } catch (error) { res.status(500).send({ message: 'Internal error findRecipeById!.' }); }
};

exports.updateRecipe = async function updateRecipe(req, res) {
    const { name, ingredients, preparation } = req.body;
    const { id } = req.params.id;
    if (!isValidFields(name, ingredients, preparation)) {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }
    
    try {
        const recipe = await recipeServices.findRecipeById(id);

        if (!recipe) {
            return res.status(404).send({ message: 'recipe not found or not permition' });
        }

        await recipeServices.updateRecipe(recipe.id, req.body);

        return res.status(200).send(await recipeServices.findRecipeById(id));
    } catch (error) { res.status(500).send({ message: 'Internal error updateRecipe!.' }); }
};

exports.deleteRecipe = async function deleteRecipe(req, res) {
    const { id } = req.params.id;
    try {
        const recipe = await recipeServices.findRecipeById(id);

        if (!recipe) {
            return res.status(404).send({ message: 'recipe not found or not permition' });
        }

        await recipeServices.deleteRecipe(recipe.id);

        return res.status(204).send();
    } catch (error) { res.status(500).send({ message: 'Internal error deleteRecipe!.' }); }
};

exports.uploadImage = async function uploadImage(req, res) {
    const { id } = req.params.id;
    try {
        const recipe = await recipeServices.findRecipeById(id);

        if (!recipe) {
            return res.status(404).send({ message: 'recipe not found' });
        }
        const urlString = 'localhost:3000/src/uploads/'.concat(recipe.id).concat('.jpg');
        await recipeServices.updateImageRecipe(recipe.id, urlString);
        return res.status(200).send(await recipeServices.findRecipeById(id));
    } catch (error) { res.status(500).send({ message: 'Internal error uploadImage!.' }); }
};
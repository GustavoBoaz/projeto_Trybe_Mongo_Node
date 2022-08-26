const mongoose = require('mongoose');

const Recipe = mongoose.model('Recipe');

exports.createRecipe = async function createRecipe(data) {
    const recipe = new Recipe(data);
    return recipe.save();
};

exports.listRecipes = async function listRecipes() {
    const recipes = Recipe.find({}, '_id name ingredients preparation userId');
    return recipes;
};

exports.findRecipeById = async function findRecipeById(id) {
    const recipe = Recipe.findOne({ id });
    return recipe;
};

exports.updateRecipe = async function updateRecipe(_id, data) {
    await Recipe.findByIdAndUpdate({ _id }, {
        $set: {
            name: data.name,
            ingredients: data.ingredients,
            preparation: data.preparation,
        },
    });
};

exports.updateImageRecipe = async function updateImageRecipe(_id, urlString) {
    await Recipe.findByIdAndUpdate({ _id }, {
        $set: {
            image: urlString,
        },
    });
};

exports.deleteRecipe = async function deleteRecipe(_id) {
    await Recipe.findByIdAndDelete({ _id });
};
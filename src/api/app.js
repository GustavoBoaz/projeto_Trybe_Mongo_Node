const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connect
mongoose.connect(MONGO_DB_URL);

// Models
require('./models/user.model');
require('./models/recipe.model');

// Routes
const userRoute = require('./routes/user.routes');
const authRoute = require('./routes/auth.routes');
const recipeRoute = require('./routes/recipe.routes');
const imageRoute = require('./routes/image.routes');

app.use('/users', userRoute);
app.use('/login', authRoute);
app.use('/recipes', recipeRoute);
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')), imageRoute);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;

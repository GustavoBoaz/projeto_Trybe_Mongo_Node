const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const frisby = require('frisby');
const fs = require('fs');
const supertest = require('supertest');
require('dotenv').config();

const path = require('path');
const app = require('../api/app');
const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Test recipe - Endpoints', () => {

    let connection;
    let db;
  
    before(async () => {
      connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = connection.db('Cookmaster');
    });
  
    beforeEach(async () => {
      await db.collection('users').deleteMany({});
      await db.collection('recipes').deleteMany({});
      const users = {
        name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };
      await db.collection('users').insertOne(users);
    });
  
    after(async () => {
      await connection.close();
    });

    describe('POST /recipes', () => {
        it ('Return status code - 201 - Create recipe', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/recipes')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            name: 'Miojão Fiel',
                            ingredients: 'Miojo picanha',
                            preparation: 'Só fritar a picanha e add Miojo'
                        });
                });
            expect(response.statusCode).equal(201);
        });
    });

    describe('POST /recipes', () => {
        it ('Return missing item name - 400', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/recipes')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            ingredients: 'Miojo picanha',
                            preparation: 'Só fritar a picanha e add Miojo'
                        });
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /recipes', () => {
        it ('Return missing item ingredients - 400', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/recipes')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            name: 'Miojão Fiel',
                            preparation: 'Só fritar a picanha e add Miojo'
                        });
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /recipes', () => {
        it ('Return missing item preparation - 400', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/recipes')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            name: 'Miojão Fiel',
                            ingredients: 'Miojo picanha'
                        });
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('PUT /recipes', () => {
        it ('Return status code - 200 - Update recipe', async () => {
            const responseLogin = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                });
            const responseCreate = await supertest(app)
                .post('/recipes')
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send({
                    name: 'Miojão Fiel',
                    ingredients: 'Miojo picanha',
                    preparation: 'Só fritar a picanha e add Miojo'
                });
            const responseUpdate = await supertest(app)
                .put(`/recipes/${responseCreate.body.recipe._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send({
                    name: 'Miojão Fiel 2.0',
                    ingredients: 'Miojo picanha Pão de alho',
                    preparation: 'Só fritar a picanha e add Miojo'
                });

            expect(responseUpdate.statusCode).equal(200);
        });
    });

    describe('DELETE /recipes', () => {
        it ('Return status code - 204 - Delete recipe', async () => {
            const responseLogin = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                });
            const responseCreate = await supertest(app)
                .post('/recipes')
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send({
                    name: 'Miojão Fiel',
                    ingredients: 'Miojo picanha',
                    preparation: 'Só fritar a picanha e add Miojo'
                });
            const responseUpdate = await supertest(app)
                .delete(`/recipes/${responseCreate.body.recipe._id}`)
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send();

            expect(responseUpdate.statusCode).equal(204);
        });
    });

    describe('ADD IMAGE /recipes', () => {
        const photoFile = path.resolve(__dirname, '..', 'src', 'uploads', 'ratinho.jpg');
        const content = fs.createReadStream(photoFile);
        const formData = frisby.formData();
        formData.append('image', content);

        it ('Return status code - 200 - Add image', async () => {
            const responseLogin = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                });
            const responseCreate = await supertest(app)
                .post('/recipes')
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send({
                    name: 'Miojão Fiel',
                    ingredients: 'Miojo picanha',
                    preparation: 'Só fritar a picanha e add Miojo'
                });
            const responseADD = await supertest(app)
                .put(`/recipes/${responseCreate.body.recipe._id}/image`, { body: formData })
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send();

            expect(responseADD.statusCode).equal(200);
        });
    });

    describe('GET ALL /recipes', () => {
        it ('Return status code - 200', async () => {
            const response = await supertest(app).get('/recipes');
            expect(response.statusCode).equal(200);
        });
    });
    describe('GET BY ID /recipes/:id', () => {
        it ('Return status code - 404', async () => {
            const response = await supertest(app).get('/recipes/999');
            expect(response.statusCode).equal(404);
        });
    });
    describe('DELETE BY ID /recipes/:id', () => {
        it ('Return status code - 401', async () => {
            const response = await supertest(app).delete('/recipes/999');
            expect(response.statusCode).equal(401);
        });
    });
});
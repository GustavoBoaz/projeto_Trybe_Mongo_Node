const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const frisby = require('frisby');
const fs = require('fs');
const supertest = require('supertest');
require('dotenv').config();

const path = require('path');
const app = require('../api/app');
const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Test image - Endpoints', () => {

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

    describe('READ IMAGE /images', () => {
        const photoFile = path.resolve(__dirname, '..', 'src', 'uploads', 'ratinho.jpg');
        const content = fs.createReadStream(photoFile);
        const formData = frisby.formData();
        formData.append('image', content);

        it ('Return status code - 200 - Read image', async () => {
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
            const responseRead = await supertest(app)
                .get(`/images/${responseCreate.body.recipe._id}.jpeg`)
                .set('Accept', 'application/json')
                .set('Authorization', responseLogin.body.token)
                .send();

            expect(responseRead.statusCode).equal(200);
        });
    });
});
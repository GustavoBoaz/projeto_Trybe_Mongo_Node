const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const supertest = require('supertest');
require('dotenv').config();

const app = require('../api/app');
const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;


describe('Test user - Endpoints', () => {

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

    describe('POST /users', () => {
        it ('Return missing item name - 400', async () => {
            const response = await supertest(app)
                .post('/users')
                .send({
                    email: 'gustavo@email.com',
                    password: '134652'
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /users', () => {
        it ('Return missing item email - 400', async () => {
            const response = await supertest(app)
                .post('/users')
                .send({
                    name: 'Gustavo Boaz',
                    password: '134652'
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /users', () => {
        it ('Return missing item password - 400', async () => {
            const response = await supertest(app)
                .post('/users')
                .send({
                    name: 'Gustavo Boaz',
                    email: 'gustavo@email.com'
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /users', () => {
        it ('Return user created - 201', async () => {
            const response = await supertest(app)
                .post('/users')
                .send({
                    name: 'Gustavo Boaz',
                    email: 'gustavo@email.com',
                    password: '134652'
                });
            expect(response.statusCode).equal(201);
        });
    });

    describe('POST /users', () => {
        it ('Return user in use - 409', async () => {
            const response1 = await supertest(app)
                .post('/users')
                .send({
                    name: 'Gustavo Boaz',
                    email: 'gustavo@email.com',
                    password: '134652'
                });

            const response2 = await supertest(app)
                .post('/users')
                .send({
                    name: 'Gustavo Boaz',
                    email: 'gustavo@email.com',
                    password: '134652'
                });
            expect(response2.statusCode).equal(409);
        });
    });

    describe('POST /users/admin', () => {
        it ('Return created admin - 201', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/users/admin')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            name: 'Gustavo Boaz',
                            email: 'gustavo@email.com',
                            password: '134652'
                        });
                });
            expect(response.statusCode).equal(201);
        });
    });

    describe('POST /users/admin', () => {
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
                        .post('/users/admin')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            email: 'gustavo@email.com',
                            password: '134652'
                        });
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /users/admin', () => {
        it ('Return missing item email - 400', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/users/admin')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            name: 'Gustavo Boaz',
                            password: '134652'
                        });
                });
            expect(response.statusCode).equal(400);
        });
    });

    describe('POST /users/admin', () => {
        it ('Return missing item password - 400', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com',
                    password: 'admin'
                })
                .then((response) => {
                    const { body } = response;
                    return supertest(app)
                        .post('/users/admin')
                        .set('Accept', 'application/json')
                        .set('Authorization', body.token)
                        .send({
                            name: 'Gustavo Boaz',
                            email: 'gustavo@email.com'
                        });
                });
            expect(response.statusCode).equal(400);
        });
    });
});
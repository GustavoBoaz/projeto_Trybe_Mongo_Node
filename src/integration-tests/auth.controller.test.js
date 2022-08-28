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

    describe('POST /login', () => {
        it ('Return missing item email - 401', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    password: 'admin'
                });
            expect(response.statusCode).equal(401);
        });
    });

    describe('POST /login', () => {
        it ('Return missing item password - 401', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'root@email.com'
                });
            expect(response.statusCode).equal(401);
        });
    });

    describe('POST /login', () => {
      it ('Return Incorret email or password - 401', async () => {
          const response = await supertest(app)
              .post('/login')
              .send({
                  email: 'root@email.com2',
                  password: 'admin'
              });
          expect(response.statusCode).equal(401);
      });
  });
});
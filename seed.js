// colocar query do MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

connection = await MongoClient.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
db = connection.db('Cookmaster');

db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });
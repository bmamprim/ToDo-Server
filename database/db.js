require('dotenv').config();

const { MongoClient } = require('mongodb');

async function connect() {

    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();

    const db = client.db('Teste');

    return db;
}

module.exports = {
    connect
}
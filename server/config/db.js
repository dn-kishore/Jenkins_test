const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'dormden';

let db;

const connectDB = async () => {
  if (db) return db;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB Connected Successfully');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.warn('MongoDB Connection Failed, using Mock In-Memory Database Fallback:', error.message);
    db = new MockDB();
    return db;
  }
};

const getDB = () => {
  if (!db) {
    db = new MockDB();
  }
  return db;
};

module.exports = { connectDB, getDB };

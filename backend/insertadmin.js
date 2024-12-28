const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // to load sensitive data from .env file

// MongoDB Atlas connection string
const uri = process.env.MONGO_URI; // Add your MongoDB URI to .env file

// Admin credentials
const adminEmail = 'admin@example.com';
const adminPassword = 'yourSecurePassword';

// Function to insert admin credentials into MongoDB
async function insertAdmin() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const database = client.db('users'); // Use your database name
    const collection = database.collection('admins'); // Use your collection name

    // Create admin document
    const adminDoc = {
      email: adminEmail,
      password: hashedPassword,
    };

    // Insert the document into the collection
    const result = await collection.insertOne(adminDoc);
    console.log(`Admin credentials inserted: ${result.insertedId}`);
    
    await client.close();
  } catch (error) {
    console.error('Error inserting admin credentials:', error);
  }
}

insertAdmin();

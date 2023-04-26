const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_URL;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db(dbName);
    console.log(database);
    const users = database.collection("users");
    console.log(users);

    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }
    const result = await users.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

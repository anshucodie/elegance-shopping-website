const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

// Replace with your MongoDB connection string from Compass or Atlas
// const uri = "mongodb://localhost:27017/yourDatabaseName"; // Local example
// const uri = 'mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/yourDatabaseName?retryWrites=true&w=majority'; // Atlas example
const uri =
  "mongodb+srv://Manush:IIITV123@cluster0.7iady.mongodb.net/Elegance?retryWrites=true&w=majority";

// Middleware to parse JSON
app.use(express.json());

async function connectToDatabase() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("Elegance");
    const collection = database.collection("MenLowers");

    // Example route to fetch data
    app.get("/api/data", async (req, res) => {
      const data = await collection.find({}).toArray();
      res.json(data);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

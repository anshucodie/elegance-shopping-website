const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

const uri =
  "mongodb+srv://Manush:IIITV123@cluster0.7iady.mongodb.net/Elegance?retryWrites=true&w=majority";

app.use(express.json());

async function connectToDatabase() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("Elegance");

    // Define multiple collections
    const collection1 = database.collection("MenLowers");
    const collection2 = database.collection("MenUppers");
    const collection3 = database.collection("WomenUppers");
    const collection4 = database.collection("WomenLowers");

    app.get("/api/data", async (req, res) => {
      try {
        const data1 = await collection1.find({}).toArray();
        const data2 = await collection2.find({}).toArray();
        const data3 = await collection3.find({}).toArray();
        const data4 = await collection4.find({}).toArray();

        console.log("Data fetched:", { data1, data2, data3, data4 });

        const combinedData = {
          collection1: data1,
          collection2: data2,
          collection3: data3,
          collection4: data4,
        };

        res.json(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Failed to fetch data" });
      }
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  } finally {
    client.close();
  }
}

connectToDatabase();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

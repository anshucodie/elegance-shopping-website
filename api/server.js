const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

const uri =
  "mongodb+srv://Manush:IIITV123@cluster0.7iady.mongodb.net/Elegance?retryWrites=true&w=majority";

// Enable CORS with additional options
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Set up routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

// Route for the product page
app.get("/product_page/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "product_page", "main.html"));
});

// Route for the individual product page
app.get("/individual_page/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "individual_page", "main.html"));
});

// Serve static files from the product_page directory
app.use("/product_page", express.static(path.join(__dirname, "product_page")));

// Serve static files from the individual_page directory
app.use(
  "/individual_page",
  express.static(path.join(__dirname, "individual_page"))
);

// Serve static files from the product_page directory for the /products route
app.use("/products", express.static(path.join(__dirname, "product_page")));

let collections = {};

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
    collections.menLowers = database.collection("MenLowers");
    collections.menUppers = database.collection("MenUppers");
    collections.womenUppers = database.collection("WomenUppers");
    collections.womenLowers = database.collection("WomenLowers");

    app.get("/api/data", async (req, res) => {
      try {
        const data1 = await collections.menLowers.find({}).toArray();
        const data2 = await collections.menUppers.find({}).toArray();
        const data3 = await collections.womenUppers.find({}).toArray();
        const data4 = await collections.womenLowers.find({}).toArray();

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

    // API endpoint to get a product by ID
    app.get("/api/product/:id", async (req, res) => {
      try {
        const productId = req.params.id;

        // Validate the ID format
        if (!ObjectId.isValid(productId)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }

        const objectId = new ObjectId(productId);

        // Search for the product in all collections
        let product = null;

        // Search in each collection
        for (const [key, collection] of Object.entries(collections)) {
          product = await collection.findOne({ _id: objectId });
          if (product) break;
        }

        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        console.log("Product found:", product);
        res.json(product);
      } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ error: "Failed to fetch product" });
      }
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

connectToDatabase();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(
    `Product page available at http://localhost:${port}/product_page/main.html`
  );
  console.log(
    `Individual product page available at http://localhost:${port}/individual_page/main.html?id=[product_id]`
  );
});

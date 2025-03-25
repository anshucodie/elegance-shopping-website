const axios = require("axios");

// Base URL for our server
const baseURL = "http://localhost:3000";

// Test all endpoints
async function testEndpoints() {
  console.log("Testing Elegance Shopping Website API routes...\n");

  try {
    // Test main page
    console.log("1. Testing main page route (/)");
    const mainRes = await axios.get(baseURL);
    console.log("✅ Main page accessible\n");

    // Test product page
    console.log("2. Testing product page route (/products)");
    const productsRes = await axios.get(`${baseURL}/products`);
    console.log("✅ Product page accessible\n");

    // Test API data endpoint
    console.log("3. Testing API data endpoint (/api/data)");
    const apiRes = await axios.get(`${baseURL}/api/data`);
    console.log("✅ API endpoint working");
    console.log(`   Retrieved ${apiRes.data.length} product items\n`);

    console.log("All routes tested successfully! 🎉");
  } catch (error) {
    console.error("❌ Error testing routes:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Instructions for use
console.log("\n==================================");
console.log("ELEGANCE WEBSITE ROUTE TESTER");
console.log("==================================");
console.log("Make sure the server is running with:");
console.log("npm start");
console.log("==================================\n");

// Run the tests only if the server is already running
console.log("Starting tests in 3 seconds...");
setTimeout(testEndpoints, 3000);

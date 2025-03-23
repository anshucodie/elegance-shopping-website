fetch("http://localhost:3000/api/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Fetched Data:", data);

    let productHTML = "";
    if (data && typeof data === "object") {
      Object.keys(data).forEach((coll) => {
        const collection = data[coll];
        if (Array.isArray(collection)) {
          collection.forEach((item) => {
            productHTML += `
              <div class="product-card">
                  <h3>${item.name}</h3>
                  <p>Price: $${item.price}</p>
                  <p>Category: ${item.category}</p>
                  <p>Ratings: ${item.ratings}</p>
                  <img src="${item.image || "default.jpg"}" alt="${
              item.name
            }" style="width:100px; height:auto;">
              </div>
            `;
          });
        }
      });
    } else {
      productHTML = "<p>No products available</p>";
    }

    const mainContainer = document.querySelector(".js-main");
    if (mainContainer) {
      mainContainer.innerHTML = productHTML;
    } else {
      console.error("Element with class 'js-main' not found.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

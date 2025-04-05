document.addEventListener("DOMContentLoaded", function () {
  const sortByPrice = document.getElementById("sort-price");
  const sortByCategory = document.getElementById("sort-category");
  const sortByRatings = document.getElementById("sort-ratings");

  let allProducts = [];

  // Fetch products from the API
  fetch("http://localhost:3000/api/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && typeof data === "object") {
        Object.keys(data).forEach((coll) => {
          const collection = data[coll];
          if (Array.isArray(collection)) {
            allProducts = allProducts.concat(collection);
          }
        });

        // Sort products alphabetically by name initially
        allProducts = bubbleSort(allProducts, (a, b) => a.name.localeCompare(b.name));

      } else {
        console.error("Invalid data format received from API.");
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });

  // Sort by price
  sortByPrice.addEventListener("click", function (e) {
    e.preventDefault();
    const sortedProducts = bubbleSort([...allProducts], (a, b) => a.price - b.price);
    renderProducts(sortedProducts);
  });

  // Sort by category
  sortByCategory.addEventListener("click", function (e) {
    e.preventDefault();
    const sortedProducts = bubbleSort([...allProducts], (a, b) =>
      a.category.localeCompare(b.category)
    );
    renderProducts(sortedProducts);
  });

  // Sort by ratings
  sortByRatings.addEventListener("click", function (e) {
    e.preventDefault();
    const sortedProducts = bubbleSort([...allProducts], (a, b) => b.ratings - a.ratings);
    renderProducts(sortedProducts);
  });

  // Bubble Sort Algorithm
  function bubbleSort(array, compareFn) {
    const len = array.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (compareFn(array[j], array[j + 1]) > 0) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  }

  // Function to render products
  
  function renderProducts(products) {
    const mainContainer = document.querySelector(".js-main");
    if (!mainContainer) {
      console.error("Element with class 'js-main' not found.");
      return;
    }

    if (products.length === 0) {
      mainContainer.innerHTML = "<p>No products match your search.</p>";
      return;
    }

    let productHTML = "";
    products.forEach((item) => {
      productHTML += `
        <div class="product">
          <a href="/individual_page/main.html?id=${item._id}" class="product-link">
          <img src="${item.image}" alt="Product Name">
          <div class="product-info">
              <h3 title="${item.name}">${item.name}</h3>
            <p>Price: <span>₹${item.price}</span> </p>
            <p>Rating: <i class="fa-regular fa-star" style="color: #000205;"></i> ${item.ratings}</p>
            </div>
          </a>
            <button class="add-to-cart-btn" data-product-id="${item._id}" data-product-name="${item.name}" data-product-price="${item.price}" data-product-image="${item.image}">Add to Cart</button>
          </div>
      `;
    });

    mainContainer.innerHTML = productHTML;
    mainContainer.classList.add("grid1");
    mainContainer.classList.add("grid-rows");
  }

});
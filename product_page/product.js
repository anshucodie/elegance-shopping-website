fetch("http://localhost:3000/api/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // console.log("Fetched Data:r", data);

    let productHTML = "";
    if (data && typeof data === "object") {
      Object.keys(data).forEach((coll) => {
        const collection = data[coll];
        if (Array.isArray(collection)) {
          collection.forEach((item) => {
            console.log(item);
            productHTML += `
        <div class="product">
          <img src="${item.image}" alt="Product Name">
            <div class="product-info">
              <h3>${item.name}</h3>
              <p>Price: ₹${item.price}</p>
              <p>Rating: ⭐ ${item.ratings}</p>
              <button class="add-to-cart-btn">Add to Cart</button>
            </div>
            </div>
            `;
          });
        }
      });
    } else {
      productHTML = "<p>No products available</p>";
    }

    console.log(productHTML);

    const mainContainer = document.querySelector(".js-main");
    if (mainContainer) {
      mainContainer.innerHTML = productHTML;
      mainContainer.classList.add("grid1");
      mainContainer.classList.add("grid-rows");
    } else {
      console.error("Element with class 'js-main' not found.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Cart Functionality
document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.getElementById("cart");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartClose = document.getElementById("cart-close");
  const cartOverlay = document.getElementById("cart-overlay");

  // Open cart when CART is clicked
  cartButton.addEventListener("click", function () {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when cart is open
  });

  // Close cart when ✕ is clicked
  cartClose.addEventListener("click", function () {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  });

  // Close cart when clicking on overlay
  cartOverlay.addEventListener("click", function () {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  });

  // Add functionality to "Add to Cart" buttons (will be added dynamically after products load)
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("add-to-cart-btn")) {
      // Open cart when adding items
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
      document.body.style.overflow = "hidden";

      // You can add more functionality here to actually add items to cart
      alert("Item added to cart!");
    }
  });
});

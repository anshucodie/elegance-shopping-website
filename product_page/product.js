fetch("http://localhost:3000/api/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    let productHTML = "";
    let allProducts = [];

    if (data && typeof data === "object") {
      Object.keys(data).forEach((coll) => {
        const collection = data[coll];
        if (Array.isArray(collection)) {
          allProducts = allProducts.concat(collection);
        }
      });

      allProducts.sort((a, b) => a.name.localeCompare(b.name));

      renderProducts(allProducts);
    } else {
      productHTML = "<p>No products available</p>";
      document.querySelector(".js-main").innerHTML = productHTML;
    }

    const searchBar = document.getElementById("search-bar-input");
    searchBar.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();

      const filteredProducts = binarySearch(allProducts, searchTerm);
      renderProducts(filteredProducts);
    });

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
                <h3>${item.name}</h3>
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

    window.clearSearchAndRenderAll = function () {
      const searchBar = document.getElementById("search-bar-input");

      if (searchBar) {
        searchBar.value = "";
        renderProducts(allProducts);
        console.log("Cleared search and rendered all products");
      } else {
        console.error("Search bar not found!");
      }
    };
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

  // Function to display cart

  function SaveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function LoadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return [];
  }

  // CART FUNCTIONALITY

  const cart = LoadCart();

  CartDisplay();

  function CartDisplay() {
    const cartItemsContainer = document.querySelector(".cart-content");
    const total = document.querySelector(".total");
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart-message">Your cart is empty.</p>';
      total.innerHTML = "<p> ₹0.00 </p>";
      localStorage.clear();
      return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
      const cartItemHTML = `
          <div class="cart-item">
            <div class="cart-image">
              <img src="${item.productImage}" class="cart-img" alt="Product Image">
            </div>
            <div class="cart-product-info">        
              <p>${item.productName}</p>
              <p>₹ ${item.productPrice}</p>
              <div class="price-cart">
                <button class="price-counter" onclick="Decrease(${index})">-</button>
                <p style="margin-right: 50px; margin-left: 50px;" class="js-quantity">${item.quantity}</p>
                <button class="price-counter" onclick="Increase(${index})">+</button>
              </div>
            </div>
          </div>
      `;
      cartItemsContainer.innerHTML += cartItemHTML;

      totalPrice += parseFloat(item.productPrice) * item.quantity;
      console.log(typeof totalPrice);
      total.innerHTML = `<p> ₹${totalPrice.toFixed(2)} </p>`;
    });

    SaveCart();
  }

  window.Increase = function (index) {
    cart[index].quantity += 1;
    CartDisplay();
  };

  window.Decrease = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      CartDisplay();
    } else {
      cart.splice(index, 1);
      CartDisplay();
    }
  };

  // Add functionality to "Add to Cart" buttons (will be added dynamically after products load)
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("add-to-cart-btn")) {
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
      document.body.style.overflow = "hidden";

      const productName = e.target.dataset.productName;
      const productPrice = e.target.dataset.productPrice;
      const productId = e.target.dataset.productId;
      const productImage = e.target.dataset.productImage;

      let matchingItem = cart.find((item) => item.productId === productId);

      if (matchingItem) {
        matchingItem.quantity += 1;
      } else {
        cart.push({
          productId: productId,
          productName: productName,
          productPrice: productPrice,
          productImage: productImage,
          quantity: 1,
        });
      }

      CartDisplay();
      console.log(cart);
    }
  });

  // Categories functionality
  const catButton = document.getElementById("cat");
  const catSidebar = document.getElementById("cat-sidebar");
  const catClose = document.getElementById("cat-close");
  const catOverlay = document.getElementById("cat-overlay");

  // Debug elements
  console.log("Categories Button:", catButton);
  console.log("Categories Sidebar:", catSidebar);
  console.log("Categories Close:", catClose);
  console.log("Categories Overlay:", catOverlay);

  // Check if all required elements exist
  if (catButton && catSidebar && catClose && catOverlay) {
    console.log("All category elements found - setting up event listeners");

    // Open categories when CATEGORIES is clicked
    catButton.addEventListener("click", function () {
      console.log("Categories button clicked");
      catSidebar.classList.add("active");
      catOverlay.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling when categories panel is open
    });

    // Close categories when clicking on overlay
    catOverlay.addEventListener("click", function () {
      console.log("Categories overlay clicked");
      catSidebar.classList.remove("active");
      catOverlay.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    });

    // Close categories when ✕ is clicked
    catClose.addEventListener("click", function () {
      console.log("Categories close button clicked");
      catSidebar.classList.remove("active");
      catOverlay.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    });
  } else {
    console.error(
      "One or more category panel elements are missing from the DOM",
      {
        catButton: !!catButton,
        catSidebar: !!catSidebar,
        catClose: !!catClose,
        catOverlay: !!catOverlay,
      }
    );
  }
});

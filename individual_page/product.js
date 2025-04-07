document.addEventListener("DOMContentLoaded", function () {
  // Cart Functionality
  const cartButton = document.getElementById("cart");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartClose = document.getElementById("cart-close");
  const cartOverlay = document.getElementById("cart-overlay");

  // Order History Functionality
  const orderHistoryBtn = document.getElementById("order-history-btn");
  const orderHistoryModal = document.getElementById("order-history");
  const orderHistoryClose = document.getElementById("order-history-close");
  const orderHistoryOverlay = document.getElementById("order-history-overlay");

  // Open cart when CART is clicked
  cartButton.addEventListener("click", function () {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close cart when ✕ is clicked
  cartClose.addEventListener("click", function () {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close cart when clicking on overlay
  cartOverlay.addEventListener("click", function () {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Open order history when ORDER HISTORY is clicked
  orderHistoryBtn.addEventListener("click", function () {
    orderHistoryModal.classList.add("active");
    orderHistoryOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    loadOrderHistory();
  });

  // Close order history when ✕ is clicked
  orderHistoryClose.addEventListener("click", function () {
    orderHistoryModal.classList.remove("active");
    orderHistoryOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close order history when clicking on overlay
  orderHistoryOverlay.addEventListener("click", function () {
    orderHistoryModal.classList.remove("active");
    orderHistoryOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Function to save cart to localStorage
  function SaveCart() {
    saveCart(cart);
  }

  // Function to load cart from localStorage
  function LoadCart() {
    return loadCart();
  }

  // Initialize cart from localStorage
  const cart = LoadCart();

  // Display the cart
  CartDisplay();

  function CartDisplay() {
    const cartItemsContainer = document.querySelector(".cart-content");
    const total = document.querySelector(".total");
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart-message">Your cart is empty.</p>';
      total.innerHTML = "<p class='numFont'> ₹0.00 </p>";
      return;
    }

    let totalPrice = calculateCartTotal(cart);

    cart.forEach((item, index) => {
      const cartItemHTML = `
          <div class="cart-item">
            <div class="cart-image">
              <img src="${item.productImage}" class="cart-img" alt="Product Image">
            </div>
            <div class="cart-product-info">        
              <p>${item.productName}</p>
              <p class="numFont">₹${item.productPrice}</p>
              <div class="price-cart">
                <button class="price-counter" onclick="Decrease(${index})">-</button>
                <p style="margin-right: 50px; margin-left: 50px;" class="js-quantity">${item.quantity}</p>
                <button class="price-counter" onclick="Increase(${index})">+</button>
              </div>
            </div>
          </div>
      `;
      cartItemsContainer.innerHTML += cartItemHTML;
    });

    total.innerHTML = `<p class="numFont"> ₹${totalPrice.toFixed(2)} </p>`;
    SaveCart();
  }

  // Increase item quantity
  window.Increase = function (index) {
    cart[index].quantity += 1;
    CartDisplay();
  };

  // Decrease item quantity or remove if quantity becomes 0
  window.Decrease = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      CartDisplay();
    } else {
      cart.splice(index, 1);
      CartDisplay();
    }
  };

  // Checkout functionality
  const checkoutBtn = document.querySelector(".checkout-btn");
  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Create order object
    const order = {
      userId: getUserId(),
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        productImage: item.productImage,
        quantity: item.quantity,
      })),
      totalAmount: calculateCartTotal(cart),
      status: "Completed",
    };

    // Send order to server
    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert("Order placed successfully!");

        // Clear the cart
        clearCart();
        cart.length = 0;

        // Update the cart display
        CartDisplay();

        // Close cart sidebar
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
        document.body.style.overflow = "";
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      });
  });

  // Calculate total cart value
  function calculateTotal() {
    return calculateCartTotal(cart);
  }

  // Function to get/generate user ID
  function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }
    return userId;
  }

  // Load order history
  function loadOrderHistory() {
    const orderHistoryList = document.querySelector(".order-history-list");
    orderHistoryList.innerHTML =
      '<p class="loading-message">Loading all orders...</p>';

    fetch(`http://localhost:3000/api/orders`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((orders) => {
        if (orders.length === 0) {
          orderHistoryList.innerHTML =
            '<p class="no-orders">No orders found in the database.</p>';
          return;
        }

        orderHistoryList.innerHTML = "";

        orders.forEach((order) => {
          const orderDate = new Date(order.timestamp).toLocaleString();
          let orderHTML = `
            <div class="order-item">
              <div class="order-date">ORDER DATE: <span class="numFont">${orderDate}</span></div>
              <div class="order-status">STATUS: ${order.status}</div>
              <div class="order-user">USER ID: <span class="numFont">${order.userId}</span></div>
              <div class="order-products">
          `;

          order.items.forEach((item) => {
            // Use the image field from MongoDB instead of productImage
            let imageUrl = item.image || item.productImage;

            // If the image URL is a relative path (doesn't start with http or https)
            if (!imageUrl.startsWith("http") && !imageUrl.startsWith("https")) {
              // If it starts with a slash, it's relative to the domain root
              if (imageUrl.startsWith("/")) {
                imageUrl = `http://localhost:3000${imageUrl}`;
              } else {
                // Otherwise, it's relative to the current path
                imageUrl = `http://localhost:3000/${imageUrl}`;
              }
            }

            console.log("Image URL:", imageUrl); // Debug log

            orderHTML += `
              <div class="order-product">
                <div class="order-product-image">
                  <img src="${imageUrl}" alt="${item.productName}" onerror="this.onerror=null; this.src='/components/placeholder.jpg'; console.log('Image failed to load:', this.src);">
                </div>
                <div class="order-product-info">
                  <p>${item.productName}</p>
                  <p class="numFont">₹${item.productPrice}  x  ${item.quantity}</p>
                </div>
              </div>
            `;
          });

          orderHTML += `
              </div>
              <div class="order-total">TOTAL: <span class="numFont">₹${order.totalAmount.toFixed(
                2
              )}</span></div>
            </div>
          `;

          orderHistoryList.innerHTML += orderHTML;
        });
      })
      .catch((error) => {
        console.error("Error loading order history:", error);
        orderHistoryList.innerHTML =
          '<p class="error-message">Error loading order history. Please try again later.</p>';
      });
  }

  // Get the product ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    document.querySelector(".about").innerHTML = "<p>Product not found</p>";
    return;
  }

  // Fetch the product details
  fetch(`http://localhost:3000/api/product/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((product) => {
      // Update the product image
      const productImg = document.querySelector(".product_img img");
      if (productImg) {
        productImg.src = product.image;
        productImg.alt = product.name;
      }

      // Update product details
      document.querySelector(".name").textContent = product.name;
      document.querySelector(".price").textContent = `₹ ${product.price.toFixed(
        2
      )}`;
      document.querySelector(".material span").textContent =
        product.material || "Not specified";

      // Update product description if available
      if (product.description) {
        document.querySelector(".description p").textContent =
          product.description;
      }

      // Set up Add to Cart functionality
      const addToCartBtn = document.querySelector(".button button");
      addToCartBtn.addEventListener("click", function () {
        // Get product details from the current page
        const productId = urlParams.get("id");
        const productName = document.querySelector(".name").textContent;
        const productPrice = parseFloat(
          document.querySelector(".price").textContent.replace("₹ ", "")
        );
        const productImage = document.querySelector(".product_img img").src;

        // Use shared utility to add to cart
        addToCart(productId, productName, productPrice, productImage);

        // Update local cart variable
        Object.assign(cart, LoadCart());

        // Display updated cart and open cart sidebar
        CartDisplay();
        cartSidebar.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      document.querySelector(".about").innerHTML =
        "<p>Error loading product details</p>";
    });
});

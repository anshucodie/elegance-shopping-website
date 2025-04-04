document.addEventListener("DOMContentLoaded", function () {
  // Cart Functionality
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

  // Function to save cart to localStorage
  function SaveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Function to load cart from localStorage
  function LoadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return [];
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
      total.innerHTML = "<p> ₹0.00 </p>";
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
      total.innerHTML = `<p> ₹${totalPrice.toFixed(2)} </p>`;
    });

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
        // Check if product is already in cart
        const existingItem = cart.findIndex(
          (item) => item.productId === product._id
        );

        if (existingItem !== -1) {
          // Increase quantity if product is already in cart
          cart[existingItem].quantity += 1;
        } else {
          // Add new product to cart
          cart.push({
            productId: product._id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            quantity: 1,
          });
        }

        // Save cart to localStorage
        SaveCart();

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

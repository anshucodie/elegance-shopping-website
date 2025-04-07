// Shared cart utilities for consistent cart management across pages

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("elegance_shopping_cart", JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("elegance_shopping_cart");
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return [];
}

// Add item to cart
function addToCart(
  productId,
  productName,
  productPrice,
  productImage,
  quantity = 1
) {
  const cart = loadCart();
  const existingItemIndex = cart.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex !== -1) {
    // Increase quantity if product is already in cart
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({
      productId,
      productName,
      productPrice,
      productImage,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
}

// Remove item from cart
function removeFromCart(productId) {
  const cart = loadCart();
  const updatedCart = cart.filter((item) => item.productId !== productId);
  saveCart(updatedCart);
  return updatedCart;
}

// Update item quantity
function updateCartItemQuantity(productId, quantity) {
  const cart = loadCart();
  const existingItemIndex = cart.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex !== -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.splice(existingItemIndex, 1);
    } else {
      // Update quantity
      cart[existingItemIndex].quantity = quantity;
    }
    saveCart(cart);
  }

  return cart;
}

// Calculate cart total
function calculateCartTotal(cart) {
  return cart.reduce((total, item) => {
    return total + parseFloat(item.productPrice) * item.quantity;
  }, 0);
}

// Clear cart
function clearCart() {
  localStorage.removeItem("elegance_shopping_cart");
  return [];
}

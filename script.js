function handleScroll() {
  const scrollPosition = window.scrollY;
  const mainLogo = document.getElementById("mainLogo");
  const bannertext = document.getElementById("bannertext");
  const header = document.getElementById("header");
  const cart = document.getElementById("cart");

  if (scrollPosition > 20) {
    mainLogo.classList.add("header-mode");
    bannertext.classList.add("transparent");
    header.classList.add("opaque");
    cart.classList.remove("transparent");
  } else {
    mainLogo.classList.remove("header-mode");
    bannertext.classList.remove("transparent");
    header.classList.remove("opaque");
    cart.classList.add("transparent");
  }
}

window.addEventListener("scroll", handleScroll);

handleScroll();

let currentImage = 1;

function getCurrentImage() {
  const product = document.getElementById("product");
  const scrollPosition = product.scrollLeft;
  const imageWidth = product.clientWidth;
  const visibleImageIndex = Math.round(scrollPosition / imageWidth) + 1;
  return visibleImageIndex;
}

function rightSlideshow() {
  let currImage = getCurrentImage();
  currImage = (currImage % 4) + 1;

  const product = document.getElementById("product");
  const imageWidth = product.clientWidth;
  product.scrollTo({
    left: (currImage - 1) * imageWidth,
    behavior: "smooth",
  });
}

function leftSlideshow() {
  let currImage = getCurrentImage();
  currImage = currImage - 1;

  if (currImage < 1) {
    currImage = 4;
  }
  const product = document.getElementById("product");
  const imageWidth = product.clientWidth;
  product.scrollTo({
    left: (currImage - 1) * imageWidth,
    behavior: "smooth",
  });
}

setInterval(() => {
  document.getElementById("rightButton").click();
}, 2000);

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
});

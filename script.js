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

function slideshow() {
  let currImage = getCurrentImage();
  currImage = (currImage % 4) + 1;

  const nextImageLink = document.querySelector(`a[href="#${currImage}"]`);
  if (nextImageLink) {
    nextImageLink.click();
  }
}

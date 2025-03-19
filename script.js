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

function slideshow() {
  // const rightButton = document.getElementById("rightButton");
  const currImg = document.getElementById("rightswipe").innerHTML;
  console.log(currImg);
  document.getElementById("img3").click();
}

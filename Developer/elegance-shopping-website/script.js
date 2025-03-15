function handleScroll() {
  const scrollPosition = window.scrollY;
  const mainLogo = document.getElementById("mainLogo");

  if (scrollPosition > 15) {
    mainLogo.classList.add("header-mode");
  } else {
    mainLogo.classList.remove("header-mode");
  }
}

window.addEventListener("scroll", handleScroll);

handleScroll();

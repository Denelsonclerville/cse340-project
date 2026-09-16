const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const menuOverlay = document.querySelector(".nav-overlay");
const navigation = document.querySelector("#site-navigation");
const menuIconOpen = document.querySelector(".menu-icon-open");
const menuIconClose = document.querySelector(".menu-icon-close");

const setNavigationState = (isOpen) => {
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Close navigation" : "Toggle navigation");
  menuIconOpen?.setAttribute("aria-hidden", String(isOpen));
  menuIconClose?.setAttribute("aria-hidden", String(!isOpen));
  navigation?.setAttribute("aria-hidden", String(!isOpen));
};

menuToggle?.addEventListener("click", () => {
  setNavigationState(!document.body.classList.contains("nav-open"));
});

menuClose?.addEventListener("click", () => setNavigationState(false));
menuOverlay?.addEventListener("click", () => setNavigationState(false));

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open") || !navigation) {
    return;
  }

  if (!navigation.contains(event.target) && !menuToggle?.contains(event.target)) {
    setNavigationState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavigationState(false);
  }
});
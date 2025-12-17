// ====== STATE ======
let selectedQty = 1;
const UNIT_PRICE = 125;
let cartQtyValue = 0;
let currentIndex = 0;

// ====== ELEMENTS ======
const menuOpen = document.querySelector(".navigation__menu-open");
const menuClose = document.querySelector(".navigation__menu-close");
const navLinks = document.querySelector(".navigation__links-wrap");
const overlay = document.querySelector(".navigation__overlay");

const cartIcon = document.querySelector(".navigation__cta-cart");
const cart = document.querySelector(".navigation__cart");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");

const cartEmpty = cart.querySelector(".cart__empty");
const cartProduct = cart.querySelector(".cart__product");
const cartQty = cart.querySelector(".cart__qty");
const cartTotal = cart.querySelector(".cart__total");
const deleteBtn = cart.querySelector(".cart__delete");
const cartBadge = document.getElementById("cart-badge");

const qtyDisplay = document.querySelector(".content__qty");
const minusBtn = document.querySelector(
  ".content__btns-controller .content__btn:first-child"
);
const plusBtn = document.querySelector(
  ".content__btns-controller .content__btn:last-child"
);

const mainImage = document.querySelector(".gallery__main");
const thumbnails = document.querySelectorAll(".gallery__mini");
const prevBtn = document.querySelector(".gallery__prev");
const nextBtn = document.querySelector(".gallery__next");

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal__content");
const modalClose = document.querySelector(".modal__close");
const modalPrev = document.querySelector(".modal__prev");
const modalNext = document.querySelector(".modal__next");

// ====== HELPERS ======
function toggleClass(el, className, add) {
  if (!el) return;
  el.classList[add ? "add" : "remove"](className);
}

function setCartEmptyState() {
  cartQtyValue = 0;
  cartEmpty.style.display = "block";
  cartProduct.style.display = "none";
  checkoutBtn.style.display = "none";
  cartQty.textContent = "0";
  cartTotal.textContent = "$0.00";
  cartBadge.style.display = "none";
}

function renderCart() {
  if (cartQtyValue > 0) {
    cartQty.textContent = String(cartQtyValue);
    cartTotal.textContent = `$${(UNIT_PRICE * cartQtyValue).toFixed(2)}`;
    cartEmpty.style.display = "none";
    cartProduct.style.display = "flex";
    checkoutBtn.style.display = "block";
    cartBadge.textContent = cartQtyValue;
    cartBadge.style.display = "inline-block";
  } else {
    setCartEmptyState();
  }
}

function updateSelectedQtyDisplay() {
  qtyDisplay.textContent = selectedQty;
}

function updateMainImage(index) {
  currentIndex = index;
  mainImage.src = images[index];
  thumbnails.forEach((t) => t.classList.remove("active-thumb"));
  if (thumbnails[index]) thumbnails[index].classList.add("active-thumb");
}

function updateModalImage(index) {
  currentIndex = index;
  modalContent.src = images[index];
  [...modalThumbContainer.children].forEach((t) =>
    t.classList.remove("active-thumb")
  );
  modalThumbContainer.children[index]?.classList.add("active-thumb");
}

// ====== INITIALIZE ======
setCartEmptyState();
selectedQty = 1;
updateSelectedQtyDisplay();

const images = Array.from(thumbnails).map((img) => img.src);

// Build modal thumbnails once
const modalThumbContainer = document.createElement("div");
modalThumbContainer.classList.add("gallery__list");
images.forEach((src, index) => {
  const thumb = document.createElement("img");
  thumb.src = src;
  thumb.className = "gallery__mini";
  thumb.addEventListener("click", () => updateModalImage(index));
  modalThumbContainer.appendChild(thumb);
});
modal.appendChild(modalThumbContainer);

// ====== EVENTS ======
// Navbar
menuOpen?.addEventListener("click", () => {
  toggleClass(navLinks, "navigation__links-wrap--open", true);
  toggleClass(overlay, "navigation__overlay--active", true);
});
menuClose?.addEventListener("click", () => {
  toggleClass(navLinks, "navigation__links-wrap--open", false);
  toggleClass(overlay, "navigation__overlay--active", false);
});
overlay?.addEventListener("click", () => {
  toggleClass(navLinks, "navigation__links-wrap--open", false);
  toggleClass(overlay, "navigation__overlay--active", false);
});

// Cart toggle
cartIcon?.addEventListener("click", (e) => {
  e.stopPropagation();
  cart.style.display = cart.style.display === "block" ? "none" : "block";
});

// Close cart when clicking outside
document.addEventListener("click", (e) => {
  const clickedInsideCart = cart.contains(e.target);
  const clickedCartIcon = cartIcon.contains(e.target);
  if (!clickedInsideCart && !clickedCartIcon) {
    cart.style.display = "none";
  }
});

// Add to Cart
addToCartBtn?.addEventListener("click", () => {
  if (selectedQty > 0) {
    cartQtyValue += selectedQty;
    renderCart();
  }
});

// Delete clears cart and hides checkout
deleteBtn?.addEventListener("click", () => {
  setCartEmptyState();
});

// Quantity controls
minusBtn?.addEventListener("click", () => {
  if (selectedQty > 1) {
    selectedQty--;
    updateSelectedQtyDisplay();
  }
});

plusBtn?.addEventListener("click", () => {
  selectedQty++;
  updateSelectedQtyDisplay();
});

// Gallery (main)
thumbnails.forEach((thumb, index) => {
  thumb.addEventListener("click", () => updateMainImage(index));
});

prevBtn?.addEventListener("click", () => {
  updateMainImage((currentIndex - 1 + images.length) % images.length);
});

nextBtn?.addEventListener("click", () => {
  updateMainImage((currentIndex + 1) % images.length);
});

// Modal
mainImage?.addEventListener("click", () => {
  if (window.innerWidth >= 920) {
    modal.style.display = "block";
    updateModalImage(currentIndex);
  }
});

modalClose?.addEventListener("click", () => {
  modal.style.display = "none";
});

modalPrev?.addEventListener("click", () => {
  updateModalImage((currentIndex - 1 + images.length) % images.length);
});

modalNext?.addEventListener("click", () => {
  updateModalImage((currentIndex + 1) % images.length);
});

const modalOverlay = document.querySelector(".modal__overlay");

mainImage.addEventListener("click", () => {
  if (window.innerWidth >= 920) {
    modal.style.display = "block";
    modalOverlay.classList.add("modal__overlay--active");
    updateModalImage(currentIndex);
  }
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
  modalOverlay.classList.remove("modal__overlay--active");
});

// Also close modal if overlay is clicked
modalOverlay.addEventListener("click", () => {
  modal.style.display = "none";
  modalOverlay.classList.remove("modal__overlay--active");
});

// Start with first image highlighted
updateMainImage(0);

// import

const cartIcon = document.querySelector(".cart-icon");
const modal = document.querySelector(".modal");
const cart = document.querySelector(".cart");
const btnConfirmCart = document.querySelector(".btn-iten-confirm");
const btnClearCart = document.querySelector(".clear-cart");
function showModalFunc() {
  modal.style.display = "block";
  cart.style.opacity = "1";
  cart.style.top = "10%";
}

function closeModalFunc() {
  modal.style.display = "none";
  cart.style.opacity = "0";
  cart.style.top = "-100%";
}

cartIcon.addEventListener("click", showModalFunc);
btnConfirmCart.addEventListener("click", closeModalFunc);
btnClearCart.addEventListener("click", closeModalFunc);

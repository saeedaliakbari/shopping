// import
import { productsData } from "./products.js";

const cartIcon = document.querySelector(".cart-icon");
const modal = document.querySelector(".modal");
const cart = document.querySelector(".cart");
const btnConfirmCart = document.querySelector(".btn-iten-confirm");
const btnClearCart = document.querySelector(".clear-cart");
const productsDOM = document.querySelector(".product-item");
let cartItem = [];
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

class Products {
  getProducts() {
    return productsData;
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
      <img class="product-img" src=${item.imageUrl} alt="" />
      <div class="product-desc">
        <div class="product-name">${item.title}</div>
        <div class="product-price">${item.price}$</div>
      </div>
      <button class="btn add-to-cart"  data-id=${item.id}>add to cart</button>
    </div>`;
    });
    productsDOM.innerHTML = result;
  }
  getAddToCartBtns() {
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
    const addToCartBtnsArray = [...addToCartBtns];
    addToCartBtnsArray.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cartItem.find((p) => p.id === id);
      if (isInCart) {
        btn.innerText = "InCart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        // console.log(event.target.dataset.id);
        btn.innerText = "InCart";
        btn.disabled = true;
        const addToCart = Storage.getProduct(id);
        cartItem = [...cartItem, { ...addToCart, quantity: 1 }];
        Storage.saveCart(cartItem);
      });
    });
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const localProducts = JSON.parse(localStorage.getItem("products"));
    // console.log(localProducts);
    return localProducts.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  Storage.saveProducts(productsData);
});

// import
import { productsData } from "./products.js";

const cartIcon = document.querySelector(".cart-icon");
const modal = document.querySelector(".modal");
const cart = document.querySelector(".cart");
const btnConfirmCart = document.querySelector(".btn-iten-confirm");
const btnClearCart = document.querySelector(".clear-cart");
const productsDOM = document.querySelector(".product-item");
const cartTotal = document.querySelector(".cart-total");
const cartItemsCount = document.querySelector(".cart-items-num");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");
let buttonsDOM = [];
let cartItem = [];
function showModalFunc() {
  modal.style.display = "flex";
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
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      let isInCart = cartItem.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "InCart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        // console.log(event.target.dataset.id);
        btn.innerText = "InCart";
        btn.disabled = true;
        const addToCart = { ...Storage.getProduct(id), quantity: 1 };
        cartItem = [...cartItem, addToCart];
        Storage.saveCart(cartItem);
        this.setCartValue(cartItem);
        this.addCartItem(addToCart);
      });
    });
  }

  setCartValue(cart) {
    let quantityCart = 0;
    let totalPrice = cart.reduce((total, cart) => {
      quantityCart += cart.quantity;
      return total + cart.price * cart.quantity;
    }, 0);
    cartTotal.innerText = `total price: ${totalPrice.toFixed(2)}$`;
    cartItemsCount.innerText = quantityCart;
  }

  addCartItem(addedCart) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img class="cart-item-img" src=${
      addedCart.imageUrl
    } alt="" />
    <div class="cart-item-desc">
      <h4>${addedCart.title}</h4>
      <h5>${addedCart.price.toFixed(2)}$</h5>
    </div>
    <div class="cart-item-controller">
      <i class="fa fa-chevron-up" data-id=${addedCart.id}></i>
      <p class="quanitity">${addedCart.quantity}</p>
      <i class="fa fa-chevron-down" data-id=${addedCart.id}></i>
    </div>
    <i class="fa fa-trash" data-id=${addedCart.id}></i>`;
    cartContent.appendChild(div);
  }

  setupApp() {
    cartItem = Storage.getCart() || [];
    cartItem.forEach((c) => {
      this.addCartItem(c);
    });
    this.setCartValue(cartItem);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCartFunc());
    cartContent.addEventListener("click", (event) => {
      let cartStorage = Storage.getCart();
      const addElement = event.target;
      if (addElement.classList.contains("fa-chevron-up")) {
        cartStorage.forEach((c) => {
          if (parseInt(c.id) === parseInt(addElement.dataset.id)) {
            c.quantity++;
            addElement.parentElement.querySelector(".quanitity").innerText =
              c.quantity;
          }
        });
      } else if (addElement.classList.contains("fa-chevron-down")) {
        cartStorage.forEach((c) => {
          if (parseInt(c.id) === parseInt(addElement.dataset.id)) {
            if (c.quantity > 1) c.quantity--;
            else {
              this.removeItem(c.id);
              addElement.parentElement.parentElement.remove();
              cartStorage = Storage.getCart();
            }
            addElement.parentElement.querySelector(".quanitity").innerText =
              c.quantity;
          }
        });
      } else if (addElement.classList.contains("fa-trash")) {
        cartStorage.forEach((c) => {
          if (parseInt(c.id) === parseInt(addElement.dataset.id)) {
            this.removeItem(c.id);
            addElement.parentElement.remove();
            cartStorage = Storage.getCart();
          }
        });
      }
      Storage.saveCart(cartStorage);
      this.setCartValue(cartStorage);
    });
  }
  clearCartFunc() {
    cartItem.forEach((c) => this.removeItem(c.id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.firstChild);
    }
  }
  removeItem(id) {
    cartItem = cartItem.filter((c) => c.id !== parseInt(id));
    this.setCartValue(cartItem);
    Storage.saveCart(cartItem);
    this.setupButtonsDOM(id);
  }

  setupButtonsDOM(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(id) === parseInt(btn.dataset.id)
    );
    button.disabled = false;
    button.innerText = "add to cart";
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
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

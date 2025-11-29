const LS_KEY = "products";

const emptyCartElement = document.querySelector(".emptyCart");
const checkoutBtn = document.getElementById("checkoutButton");

const getLocalStorageData = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

const toggleEmptyCartMessage = () =>
  !getLocalStorageData(LS_KEY).length
    ? emptyCartElement.classList.remove("d-none")
    : emptyCartElement.classList.add("d-none");

const renderCartItems = () => {
  const products = getLocalStorageData(LS_KEY);
  const cartItemsContainer = document.querySelector(".cartItems");

  if (!products.length) return (cartItemsContainer.innerHTML = "");

  let html = "";
  products.forEach((product) => {
    html += `
      <div class="card">
        <div class="image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="cardInfo">
          <p class="productName font-montserrat-medium">${product.name}</p>
          <p class="productPrice">$ ${
            +product.price.split(" ")[1] * product.quantity
          }</p>
          <div class="quantity">
            <button class="decrease">−</button>
            <span>${product.quantity}</span>
            <button class="increase">+</button>
          </div>
        </div>
      </div>
    `;
  });
  cartItemsContainer.innerHTML = html;
};

const renderTotalPrice = () => {
  const products = getLocalStorageData(LS_KEY);
  const totalAmountElement = document.getElementById("totalAmount");

  let total = 0;
  products.forEach((product) => {
    total += +product.price.split(" ")[1] * product.quantity;
  });

  totalAmountElement.textContent = `$ ${total}`;
};

const clearCart = () => {
  localStorage.clear();
  updateCartUI();
};

const getDecreaseButtonLabel = (quantity) => {
  return +quantity > 1 ? "−" : "🗑️";
};

const attachCartItemEventListeners = () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const productName = card
      .querySelector(".productName")
      .textContent.toLowerCase();
    const decreaseBtn = card.querySelector(".decrease");
    const increaseBtn = card.querySelector(".increase");
    const quantitySpan = card.querySelector("span");

    if (quantitySpan.textContent == 1)
      decreaseBtn.textContent = getDecreaseButtonLabel(
        quantitySpan.textContent
      );

    increaseBtn.addEventListener("click", () => {
      const products = getLocalStorageData(LS_KEY);
      products.forEach((item) => {
        if (item.name === productName) {
          item.quantity += 1;
          quantitySpan.textContent = item.quantity;
          decreaseBtn.textContent = getDecreaseButtonLabel(item.quantity);
        }
      });
      localStorage.setItem(LS_KEY, JSON.stringify(products));
      updateCartUI();
    });

    decreaseBtn.addEventListener("click", () => {
      let products = getLocalStorageData(LS_KEY);

      products = products.filter((item) => {
        if (item.name === productName) {
          item.quantity -= 1;
          quantitySpan.textContent = item.quantity;
          decreaseBtn.textContent = getDecreaseButtonLabel(item.quantity);

          if (item.quantity < 1) {
            return false;
          }
        }
        return true;
      });

      localStorage.setItem(LS_KEY, JSON.stringify(products));
      updateCartUI();
    });
  });
};

const updateCartUI = () => {
  toggleEmptyCartMessage();
  renderTotalPrice();
  renderCartItems();
  attachCartItemEventListeners();
};

window.addEventListener("load", () => {
  updateCartUI();
  checkoutBtn.addEventListener("click", clearCart);
});
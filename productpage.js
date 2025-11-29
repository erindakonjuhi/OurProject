const STORAGE_KEY = "products";

const loadCartProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCartProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const searchByName = document.getElementById("searchByName");
const buttons = document.querySelectorAll(".searchByCategory button");
const priceButton = document.getElementById("priceButton");
const cards = document.querySelectorAll(".card");

const searchName = (event) => {
  const searchValue = event.target.value.toLowerCase();
  cards.forEach((card) => {
    const cardName = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = cardName.includes(searchValue) ? "block" : "none";
  });
};

const searchCategory = (button) => {
  buttons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");

  const category = button.dataset.category;
  cards.forEach((card) => {
    const cardCategory = card.dataset.category;
    if (category === "all" || category === cardCategory) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

const searchPrice = () => {
  const priceInput = +document.getElementById("searchByPrice").value;
  cards.forEach((card) => {
    const priceText = card.querySelector("p").textContent;
    const price = +priceText.split(" ")[1];
    if (!priceInput || priceInput === price) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

const addProductToCart = (card) => {
  const products = loadCartProducts();

  const product = {
    image: card.querySelector("img").src,
    name: card.querySelector("h3").textContent.toLowerCase(),
    price: card.querySelector("p").textContent.toLowerCase(),
    quantity: 1,
  };

  const existingProduct = products.find((p) => p.name === product.name);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    products.push(product);
  }

  saveCartProducts(products);

  const quantityContainer = card.querySelector(".quantity");
  const addButton = card.querySelector(".addToCart");
  const quantitySpan = quantityContainer.querySelector("span");
  const reduceBtn = quantityContainer.querySelector(".reduce");

  quantityContainer.classList.remove("d-none");
  addButton.classList.add("d-none");
  quantitySpan.textContent = existingProduct ? existingProduct.quantity : 1;
  reduceBtn.textContent = getReduceButtonSymbol(quantitySpan.textContent);
};

const getReduceButtonSymbol = (quantity) => {
  return +quantity > 1 ? "−" : "🗑️";
};

const increaseQuantity = (card) => {
  const products = loadCartProducts();
  const productName = card.querySelector("h3").textContent.toLowerCase();
  const quantitySpan = card.querySelector(".quantity span");
  const reduceBtn = card.querySelector(".quantity .reduce");

  const product = products.find((p) => p.name === productName);
  if (product) {
    product.quantity++;
    saveCartProducts(products);

    quantitySpan.textContent = product.quantity;
    reduceBtn.textContent = getReduceButtonSymbol(product.quantity);
  }
};

const decreaseQuantity = (card) => {
  const products = loadCartProducts();
  const productName = card.querySelector("h3").textContent.toLowerCase();
  const quantityContainer = card.querySelector(".quantity");
  const quantitySpan = quantityContainer.querySelector("span");
  const reduceBtn = quantityContainer.querySelector(".reduce");
  const addButton = card.querySelector(".addToCart");

  const productIndex = products.findIndex((p) => p.name === productName);
  if (productIndex > -1) {
    products[productIndex].quantity--;

    if (products[productIndex].quantity < 1) {
      products.splice(productIndex, 1);
      quantityContainer.classList.add("d-none");
      addButton.classList.remove("d-none");
    } else {
      quantitySpan.textContent = products[productIndex].quantity;
      reduceBtn.textContent = getReduceButtonSymbol(
        products[productIndex].quantity
      );
    }

    saveCartProducts(products);
  }
};
const initializeCartUI = () => {
  const products = loadCartProducts();

  cards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase();
    const quantityContainer = card.querySelector(".quantity");
    const addButton = card.querySelector(".addToCart");
    const quantitySpan = quantityContainer.querySelector("span");
    const reduceBtn = quantityContainer.querySelector(".reduce");

    const product = products.find((p) => p.name === productName);
    if (product) {
      quantityContainer.classList.remove("d-none");
      addButton.classList.add("d-none");
      quantitySpan.textContent = product.quantity;
      reduceBtn.textContent = getReduceButtonSymbol(product.quantity);
    }
  });
};

const attachCardEventListeners = () => {
  cards.forEach((card) => {
    const addBtn = card.querySelector(".addToCart");
    const addQtyBtn = card.querySelector(".add");
    const reduceQtyBtn = card.querySelector(".reduce");

    addBtn.addEventListener("click", () => addProductToCart(card));
    addQtyBtn.addEventListener("click", () => increaseQuantity(card));
    reduceQtyBtn.addEventListener("click", () => decreaseQuantity(card));
  });
};

window.addEventListener("load", () => {
  attachCardEventListeners();
  initializeCartUI();

  buttons.forEach((button) => {
    button.addEventListener("click", () => searchCategory(button));
  });
  searchByName.addEventListener("keyup", searchName);
  priceButton.addEventListener("click", searchPrice);
});
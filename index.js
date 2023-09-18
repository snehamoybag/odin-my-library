const Library = function () {
  this.booksArr = [];
};

Library.prototype.getRandomHEXColor = function () {
  const supportedChars = "0123456789ABCDEF";
  let randomColor = "#";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * supportedChars.length);
    randomColor += supportedChars[randomIndex];
  }
  return randomColor;
};

Library.prototype.getNewBookData = function () {
  const form = document.querySelector("#new-book-form");
  const allInputEls = form.querySelectorAll("[name]");
  const newBookObj = {};
  allInputEls.forEach((inputEl) => {
    newBookObj[inputEl.name] = inputEl.value;
  });
  newBookObj["book-cover-color"] = this.getRandomHEXColor();
  return newBookObj;
};

Library.prototype.appendNewBookData = function (bookObj) {
  this.booksArr.unshift(bookObj); // newest to oldest
};

Library.prototype.deleteBookData = function (bookObj) {
  console.log("removed");
};

const Card = function () {
  return this;
};

Card.prototype.createNew = function (bookObj) {
  const cardEl = document.querySelector("#card-template").cloneNode(true);
  const thumbnailSVG = cardEl.querySelector(".card__thumbnail");
  const nameEl = cardEl.querySelector(".card__title");
  const authorEl = cardEl.querySelector(".card__author");
  const categoryEl = cardEl.querySelector(".card__category");
  const pagesEl = cardEl.querySelector(".card__pages");
  const statusEl = cardEl.querySelector(".card__status");
  nameEl.textContent = bookObj["book-name"];
  authorEl.textContent = bookObj["book-author"];
  categoryEl.textContent = bookObj["book-category"];
  pagesEl.textContent = bookObj["book-pages"];
  statusEl.textContent = bookObj["book-read-status"];
  cardEl.removeAttribute("id");
  cardEl.classList.remove("hidden");
  thumbnailSVG.style.setProperty("--cover-color", bookObj["book-cover-color"]);
  return cardEl;
};

Card.prototype.renderAll = function (arrOfBooksData, element) {
  arrOfBooksData.forEach((bookObj) => element.append(this.createNew(bookObj)));
};

// initialize library and card object
const library = new Library();
const card = new Card();

// add prompt for user to submit book data
const formModalEl = document.querySelector("#form-modal");
const openFormModalBtnEl = document.querySelector("#open-form-modal-btn");
const closeFormModalBtnEl = document.querySelector("#close-form-modal-btn");
openFormModalBtnEl.addEventListener("click", () => formModalEl.showModal()); // built in dialog method
closeFormModalBtnEl.addEventListener("click", () => formModalEl.close()); // built in dialog method

formModalEl.addEventListener("submit", () => {
  const newCardsEl = document.querySelector("#new-cards");
  const cardsFragment = new DocumentFragment();
  const newBookData = library.getNewBookData();
  library.appendNewBookData(newBookData);
  card.renderAll(library.booksArr, cardsFragment);
  newCardsEl.innerHTML = ""; // clear previous cards
  newCardsEl.append(cardsFragment);
  formModalEl.querySelector("#new-book-form").reset(); // reset form to default state
});

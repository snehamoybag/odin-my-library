const Library = function () {
  this.booksArr = [];
};

Library.prototype.getNewBookData = function () {
  const form = document.querySelector("#new-book-form");
  const allInputEls = form.querySelectorAll("[name]");
  const newBookObj = {};
  allInputEls.forEach((inputEl) => {
    newBookObj[inputEl.name] = inputEl.value;
  });
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

Card.prototype.getRandomHEXColor = function () {
  const supportedChars = "0123456789ABCDEF";
  let randomColor = "#";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * supportedChars.length);
    randomColor += supportedChars[randomIndex];
  }
  return randomColor;
};

Card.prototype.createNewThumbnailSVG = function () {
  const OGThumbnailSVG = document.querySelector("svg[data-id='-1']");
  const clonedThumbnailSVG = OGThumbnailSVG.cloneNode(true); // deep clone
  clonedThumbnailSVG.classList.remove("hidden");
  clonedThumbnailSVG.style.setProperty(
    "--cover-color",
    this.getRandomHEXColor()
  );
  return clonedThumbnailSVG;
};

Card.prototype.createNew = function (bookObj) {
  const bookData = bookObj;
  const cardEl = document.createElement("div");
  const thumbnailEl = document.createElement("div");
  const thumbnailSVG = this.createNewThumbnailSVG();
  const textContentWrapperEl = document.createElement("div");
  const nameEl = document.createElement("h2");
  const authorEl = document.createElement("p");
  const pagesEl = document.createElement("p");
  const categoryEl = document.createElement("p");
  const statusEl = document.createElement("p");
  nameEl.textContent = bookData["book-name"];
  authorEl.textContent = bookData["book-author"];
  pagesEl.textContent = bookData["book-pages"];
  statusEl.textContent = bookData["book-read-status"];
  thumbnailEl.append(thumbnailSVG);
  textContentWrapperEl.append(nameEl, authorEl, pagesEl, categoryEl, statusEl);
  cardEl.append(thumbnailEl, textContentWrapperEl);
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

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
  // adding 2 new proprties on each book obj for identification purposes
  newBookObj["book-cover-color"] = this.getRandomHEXColor();
  newBookObj["book-uid"] = Date.now(); // creation time becomes the uid
  return newBookObj;
};

Library.prototype.appendNewBookData = function (bookObj) {
  this.booksArr.unshift(bookObj); // newest to oldest
};

Library.prototype.editBookData = function (bookUid) {
  console.log("hi");
};

Library.prototype.deleteBookDataObj = function (deletingBookObj) {
  const updatedBooksArr = this.booksArr.filter(
    (bookObj) => bookObj !== deletingBookObj
  );
  this.booksArr = updatedBooksArr;
};

Library.prototype.createNewCard = function (bookObj) {
  const cardEl = document.querySelector("#card-template").cloneNode(true);
  const thumbnailSVG = cardEl.querySelector(".card__thumbnail");
  const nameEl = cardEl.querySelector(".card__title");
  const authorEl = cardEl.querySelector(".card__author");
  const categoryEl = cardEl.querySelector(".card__category");
  const pagesEl = cardEl.querySelector(".card__pages");
  const statusEl = cardEl.querySelector(".card__status");
  const deleteBtnEl = cardEl.querySelector("[data-btn-type=delete]");
  nameEl.textContent = bookObj["book-name"];
  authorEl.textContent = bookObj["book-author"];
  categoryEl.textContent = bookObj["book-category"];
  pagesEl.textContent = bookObj["book-pages"];
  statusEl.textContent = bookObj["book-read-status"];
  cardEl.removeAttribute("id");
  cardEl.dataset.cardUid = bookObj["book-uid"];
  cardEl.classList.remove("hidden");
  thumbnailSVG.style.setProperty("--cover-color", bookObj["book-cover-color"]);
  deleteBtnEl.addEventListener("click", () => {
    this.deleteBookDataObj(bookObj);
    this.renderAllCards();
  });
  return cardEl;
};

Library.prototype.renderAllCards = function () {
  const cardsContainer = document.querySelector("#new-cards");
  const fragmentContainer = new DocumentFragment(); // virtual dom element, improves performance
  this.booksArr.forEach((bookObj) =>
    fragmentContainer.append(this.createNewCard(bookObj))
  );
  cardsContainer.innerHTML = ""; // remove previous cards
  cardsContainer.append(fragmentContainer);
};

// initialize object
const library = new Library();

// add prompt for user to submit book data
const formModalEl = document.querySelector("#form-modal");
const openFormModalBtnEl = document.querySelector("#open-form-modal-btn");
const closeFormModalBtnEl = document.querySelector("#close-form-modal-btn");
openFormModalBtnEl.addEventListener("click", () => formModalEl.showModal()); // built in dialog method
closeFormModalBtnEl.addEventListener("click", () => formModalEl.close()); // built in dialog method

formModalEl.addEventListener("submit", () => {
  const newBookData = library.getNewBookData();
  library.appendNewBookData(newBookData);
  library.renderAllCards();
  formModalEl.querySelector("#new-book-form").reset(); // reset form to default state
});

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

Library.prototype.getBookData = function (formEl) {
  const bookObj = {};
  const allInputEls = formEl.querySelectorAll("[name]");
  allInputEls.forEach((inputEl) => {
    bookObj[inputEl.name] = inputEl.value;
  });
  return bookObj;
};

Library.prototype.appendNewBookData = function (bookObj) {
  bookObj["book-cover-color"] = this.getRandomHEXColor(); // assign a permanent cover color
  this.booksArr.unshift(bookObj); // newest to oldest
};

Library.prototype.deleteBookDataObj = function (deletingBookObj) {
  const updatedBooksArr = this.booksArr.filter(
    (bookObj) => bookObj !== deletingBookObj
  );
  this.booksArr = updatedBooksArr;
};

Library.prototype.getEditModal = function (bookObj) {
  const editModalId = "edit-book-modal";
  const editFormId = "edit-book-form";
  let editModalEl = document.getElementById(editModalId);
  // clone modal if it is not already present on dom
  if (!editModalEl) {
    // update attributes
    editModalEl = document.querySelector("#new-book-modal").cloneNode(true);
    editModalEl.setAttribute("id", editModalId);
    editModalEl.querySelector("form").setAttribute("id", editFormId);
  }
  const editFormEl = editModalEl.querySelector(`#${editFormId}`);
  const allInputEls = editFormEl.querySelectorAll("[name]");
  const submitBtnEl = editFormEl.querySelector("[data-btn-type=add]");
  const cancelBtnEl = editModalEl.querySelector("[data-btn-type=cancel]");
  submitBtnEl.textContent = "Submit";
  // assigning bookObj current values to be the default value of all inputs
  allInputEls.forEach((inputEl) => {
    if (bookObj.hasOwnProperty(inputEl.name)) {
      inputEl.value = bookObj[inputEl.name];
    }
  });
  editFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const editedBookObj = this.getBookData(editFormEl);
    const savedBookObj = this.booksArr[this.booksArr.indexOf(bookObj)]; // get the original object in the booksArr
    for (const key in editedBookObj) {
      savedBookObj[key] = editedBookObj[key]; // update saved object with edited data
    }
    this.renderAllCards();
    editModalEl.close();
  });
  cancelBtnEl.addEventListener("click", () => editModalEl.close());
  return editModalEl;
};

Library.prototype.createNewCard = function (bookObj) {
  const cardEl = document.querySelector("#card-template").cloneNode(true);
  const thumbnailSVG = cardEl.querySelector(".card__thumbnail");
  const nameEl = cardEl.querySelector(".card__title");
  const authorEl = cardEl.querySelector(".card__author");
  const categoryEl = cardEl.querySelector(".card__category");
  const pagesEl = cardEl.querySelector(".card__pages");
  const statusEl = cardEl.querySelector(".card__status");
  const editBtnEl = cardEl.querySelector("[data-btn-type=edit]");
  const deleteBtnEl = cardEl.querySelector("[data-btn-type=delete]");
  nameEl.textContent = bookObj["book-name"];
  authorEl.textContent = "Author: " + bookObj["book-author"];
  categoryEl.textContent = "Genre: " + bookObj["book-category"];
  pagesEl.textContent = "Pages: " + bookObj["book-pages"];
  statusEl.textContent = "Status: " + bookObj["book-read-status"];
  cardEl.removeAttribute("id");
  cardEl.classList.remove("hidden");
  thumbnailSVG.style.setProperty("--cover-color", bookObj["book-cover-color"]);
  editBtnEl.addEventListener("click", () => {
    let editModalEl = document.querySelector("main #edit-book-modal");
    // only append a new modal if it is not already present on dom
    if (!editModalEl) {
      editModalEl = this.getEditModal(bookObj);
      document.querySelector("main").prepend(editModalEl);
    }
    editModalEl.showModal();
  });
  deleteBtnEl.addEventListener("click", () => {
    this.deleteBookDataObj(bookObj);
    this.renderAllCards();
  });
  return cardEl;
};

Library.prototype.renderAllCards = function () {
  const cardsContainer = document.querySelector("#cards-container");
  const fragmentContainer = new DocumentFragment(); // virtual dom element, improves performance
  const deletePrevCards = () => {
    const emptyCard = document.querySelector("#empty-card");
    while (emptyCard !== cardsContainer.lastChild) {
      emptyCard.nextSibling.remove();
    }
  };

  this.booksArr.forEach((bookObj) =>
    fragmentContainer.append(this.createNewCard(bookObj))
  );
  deletePrevCards(); // remove previous cards
  cardsContainer.append(fragmentContainer);
};

// initialize object
const library = new Library();

// add prompt for user to submit book data
const newBookModalEl = document.querySelector("#new-book-modal");
const newBookFormEl = newBookModalEl.querySelector("#new-book-form");
const openFormModalBtnEl = document.querySelector("#empty-card");
const closeFormModalBtnEl = newBookModalEl.querySelector(
  "[data-btn-type=cancel]"
);
openFormModalBtnEl.addEventListener("click", () => newBookModalEl.showModal()); // built in dialog method
closeFormModalBtnEl.addEventListener("click", () => newBookModalEl.close()); // built in dialog method

newBookFormEl.addEventListener("submit", (event) => {
  const newBookData = library.getBookData(newBookFormEl);
  library.appendNewBookData(newBookData);
  library.renderAllCards();
  newBookModalEl.close();
  newBookFormEl.reset(); // reset form to default state
});

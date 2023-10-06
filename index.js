class Library {
  #library = [];
  get library() {
    return this.#library;
  }
  addToLibrary(book) {
    this.#library.unshift(book); // add it at the beginning
  }
  removeFromLibrary(book) {
    this.#library = this.#library.filter((currentBook) => currentBook !== book);
  }
}

class Book {
  constructor(name, author, pages, category, readStatus, coverColor) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.category = category;
    this.readStatus = readStatus;
    this.coverColor = coverColor;
  }
}

class Card extends Library {
  createNewCard(book, modal) {
    const cardEl = document.querySelector("#card-template").cloneNode(true);
    const thumbnailSVG = cardEl.querySelector(".card__thumbnail");
    const nameEl = cardEl.querySelector(".card__title");
    const authorEl = cardEl.querySelector(".card__author");
    const categoryEl = cardEl.querySelector(".card__category");
    const pagesEl = cardEl.querySelector(".card__pages");
    const statusEl = cardEl.querySelector(".card__status");
    const editBtnEl = cardEl.querySelector("[data-btn-type=edit]");
    const deleteBtnEl = cardEl.querySelector("[data-btn-type=delete]");
    nameEl.textContent = book.author;
    authorEl.textContent = "Author: " + book.author;
    categoryEl.textContent = "Category: " + book.category;
    pagesEl.textContent = "Pages: " + book.pages;
    statusEl.textContent = "Status: " + book.readStatus;
    cardEl.removeAttribute("id");
    cardEl.classList.remove("hidden");
    thumbnailSVG.style.setProperty("--cover-color", book.coverColor);
    editBtnEl.addEventListener("click", () => modal.showModal());
    deleteBtnEl.add("click", (book) => this.removeFromLibrary(book));
  }
}

class Utilities {
  getRandomHEXColor() {
    const supportedChars = "0123456789ABCDEF";
    let randomHEXColorCode = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * supportedChars.length);
      randomHEXColorCode += supportedChars[randomIndex];
    }
    return `#${randomHEXColorCode}`;
  }
}

class Library {
  constructor(storageKey) {
    this.STORAGE_KEY = storageKey;
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
  }

  setData(newData) {
    if (!this.STORAGE_KEY) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
  }

  addItem(item) {
    const newData = this.getData();
    newData.unshift(item); // adds it at the beginning
    this.setData(newData);
  }

  removeItem(itemUID) {
    const newData = this.getData().filter(
      (currentItem) => currentItem.UID !== itemUID
    );

    this.setData(newData);
  }

  editItem(prevItem, newItem) {
    const checkEdit = () => {
      const keysOfNewItem = Object.keys(newItem);
      const editedKeys = keysOfNewItem.filter(
        (key) => newItem[key] !== prevItem[key]
      );
      const isEdited = editedKeys.length > 0;
      return isEdited;
    };

    // do nothing if item is not edited
    const isItemEdited = checkEdit();
    if (!isItemEdited) return;

    // if item is edited
    const libraryData = this.getData();
    const indexOfPrevItem = libraryData.indexOf(prevItem);

    //remove the previous item, add the new/edited item at the beginning
    this.removeItem(prevItem.UID);
    this.addItem(newItem);
  }

  render() {
    const libraryData = this.getData();
    const itemUIEls = libraryData.map((item) => new Card(item, this).get());

    const containerEl = document.querySelector("#cards-container");
    const removePrevRender = () => {
      const newCardBtnEl = document.querySelector("#new-card-btn");
      while (newCardBtnEl !== containerEl.lastChild) {
        newCardBtnEl.nextSibling.remove();
      }
    };

    removePrevRender();
    containerEl.append(...itemUIEls);
  }
}

class Book {
  constructor(UID, coverColor, name, author, pages, category, status) {
    this.UID = UID;
    this.coverColor = coverColor;
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.category = category;
    this.status = status;
  }
}

class Card {
  constructor(book, library) {
    this.book = book;
    this.library = library;
  }

  get() {
    const { coverColor, name, author, pages, category, status } = this.book;

    const cardTemplate = document.querySelector("#card-template");

    const cardEl = cardTemplate.cloneNode(true);
    cardEl.removeAttribute("id");
    cardEl.classList.remove("hidden");

    const thumbnailEl = cardEl.querySelector("[data-id=card-thumbnail]");
    thumbnailEl.style.setProperty("--cover-color", coverColor);

    const titlEl = cardEl.querySelector("[data-id=book-name]");
    titlEl.textContent = name;

    const authorEl = cardEl.querySelector("[data-id=book-author]");
    authorEl.textContent = author;

    const pagesEl = cardEl.querySelector("[data-id=book-pages");
    pagesEl.textContent = pages;

    const categoryEl = cardEl.querySelector("[data-id=book-category]");
    categoryEl.textContent = category;

    const statusEl = cardEl.querySelector("[data-id=book-status]");
    statusEl.textContent = status;

    const editBtnEl = cardEl.querySelector("[data-btn-type=edit]");
    editBtnEl.addEventListener("click", () =>
      new BookFormModal(this.book, this.library).show()
    );

    const deleteBtnEl = cardEl.querySelector("[data-btn-type=delete]");
    deleteBtnEl.addEventListener("click", () => {
      this.library.removeItem(this.book.UID);
      this.library.render();
    });

    return cardEl;
  }
}

class BookFormModal {
  constructor(book, library) {
    this.book = book || {}; // make sure we always have an object to work with
    this.library = library;
  }

  show() {
    const { UID, coverColor, name, author, pages, category, status } =
      this.book;

    const templateModalEl = document.querySelector("#book-modal");
    const modalEl = templateModalEl.cloneNode(true);
    modalEl.classList.remove("hidden");

    const formEl = modalEl.querySelector("#book-form");

    const nameInputEl = formEl.querySelector("#book-name");
    nameInputEl.value = name || "";

    const authorInputEl = formEl.querySelector("#book-author");
    authorInputEl.value = author || "";

    const pagesInputEl = formEl.querySelector("#book-pages");
    pagesInputEl.value = pages || "";

    const categoryInputEl = formEl.querySelector("#book-category");
    const allCategoryOptEls = categoryInputEl.querySelectorAll("option");
    allCategoryOptEls.forEach((optEl) => {
      if (optEl.textContent === category) optEl.setAttribute("selected", "");
    });

    const statusInputEl = formEl.querySelector("#book-status");
    const allStatusOptEls = statusInputEl.querySelectorAll("option");
    allStatusOptEls.forEach((optEl) => {
      if (optEl.textContent === status) optEl.setAttribute("selected", "");
    });

    const closeAndRemoveModal = () => {
      modalEl.close();
      modalEl.remove();
    };

    const cancelBtnEl = formEl.querySelector("#book-modal-cancel-btn");
    cancelBtnEl.addEventListener("click", () => closeAndRemoveModal());

    const submitBtnEl = formEl.querySelector("#book-modal-submit-btn");
    submitBtnEl.textContent = UID ? "Done" : "Add";

    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.library) return; // if library is not provided, do nothing

      const getNewBook = () => {
        return new Book(
          UID || Date.parse(new Date()), // creation timestamp as the id
          coverColor || new Utilities().getRandomHEXColor(),
          nameInputEl.value,
          authorInputEl.value,
          pagesInputEl.value,
          categoryInputEl.value,
          statusInputEl.value
        );
      };

      const addNewBook = () => {
        this.library.addItem(getNewBook());
      };

      const editBook = () => {
        const prevBook = this.book;
        const newBook = getNewBook();

        this.library.editItem(prevBook, newBook);
      };

      if (name) {
        editBook();
      } else {
        addNewBook();
      }

      this.library.render();
      closeAndRemoveModal();
    });

    const mainEl = document.querySelector("main");
    mainEl.append(modalEl);
    modalEl.showModal();
  }
}

const library = new Library("books-library");
library.render();

const newCardBtn = document.querySelector("#new-card-btn");
newCardBtn.addEventListener("click", () =>
  new BookFormModal(null, library).show()
);

// add prompt for user to submit book data
const formModalEl = document.querySelector("#form-modal");
const openFormModalBtnEl = document.querySelector("#open-form-modal-btn");
const closeFormModalBtnEl = document.querySelector("#close-form-modal-btn");
openFormModalBtnEl.addEventListener("click", () => formModalEl.showModal()); // built in dialog method
closeFormModalBtnEl.addEventListener("click", () => formModalEl.close()); // built in dialog method

// get form data
const getNewBookData = () => {
  const form = document.querySelector("#new-book-form");
  const allInputEls = form.querySelectorAll("[name]");
  const newBookObj = {};
  allInputEls.forEach((inputEl) => {
    newBookObj[inputEl.name] = inputEl.value;
  });
  return newBookObj;
};

const getRandomHEXColor = () => {
  const supportedChars = "0123456789ABCDEF";
  let randomColor = "#";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * supportedChars.length);
    randomColor += supportedChars[randomIndex];
  }
  return randomColor;
};

const createANewThumbnailSVG = () => {
  const OGThumbnailSVG = document.querySelector("#card-thumbnail-svg");
  const clonedThumbnailSVG = OGThumbnailSVG.cloneNode(true);
  clonedThumbnailSVG.classList.remove("hidden");
  clonedThumbnailSVG.style.setProperty("--cover-color", getRandomHEXColor());
  return clonedThumbnailSVG;
};

const createABookCardEl = () => {
  const bookData = getNewBookData();
  const cardEl = document.createElement("div");
  const thumbnailEl = document.createElement("div");
  const thumbnailSVG = createANewThumbnailSVG();
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

formModalEl.addEventListener("submit", (event) => {
  document.querySelector("#cards").append(createABookCardEl());
  formModalEl.querySelector("#new-book-form").reset(); // reset form
});

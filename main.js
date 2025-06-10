let books = [];

document.addEventListener('DOMContentLoaded', function () {
  const bookForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');

  loadBooks();

  bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    searchBook();
  });
});

function generateId() {
  return +new Date();
}

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
  const data = localStorage.getItem('books');
  if (data) {
    books = JSON.parse(data);
    renderBooks();
  }
}

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const id = generateId();
  const book = { id, title, author, year, isComplete };
  books.push(book);
  saveBooks();
  renderBooks();
  document.getElementById('bookForm').reset();
}

function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.innerText = book.title;
  title.setAttribute('data-testid', 'bookItemTitle');

  const author = document.createElement('p');
  author.innerText = `Penulis: ${book.author}`;
  author.setAttribute('data-testid', 'bookItemAuthor');

  const year = document.createElement('p');
  year.innerText = `Tahun: ${book.year}`;
  year.setAttribute('data-testid', 'bookItemYear');

  const completeBtn = document.createElement('button');
  completeBtn.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  completeBtn.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeBtn.addEventListener('click', function () {
    toggleBookStatus(book.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Hapus Buku';
  deleteBtn.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteBtn.addEventListener('click', function () {
    deleteBook(book.id);
  });

  const editBtn = document.createElement('button');
  editBtn.innerText = 'Edit Buku';
  editBtn.setAttribute('data-testid', 'bookItemEditButton');
  editBtn.addEventListener('click', function () {
    editBook(book.id);
  });

  const btnContainer = document.createElement('div');
  btnContainer.appendChild(completeBtn);
  btnContainer.appendChild(deleteBtn);
  btnContainer.appendChild(editBtn);

  bookItem.appendChild(title);
  bookItem.appendChild(author);
  bookItem.appendChild(year);
  bookItem.appendChild(btnContainer);
  bookItem.classList.add('bookItem');
  return bookItem;
}

function renderBooks(filter = '') {
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');

  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  books
    .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(book => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeList.appendChild(bookElement);
      } else {
        incompleteList.appendChild(bookElement);
      }
    });
}

function toggleBookStatus(id) {
  const book = books.find(book => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter(book => book.id !== id);
  saveBooks();
  renderBooks();
}

function editBook(id) {
  const book = books.find(book => book.id === id);
  if (!book) return;

  const newTitle = prompt('Judul baru:', book.title);
  const newAuthor = prompt('Penulis baru:', book.author);
  const newYear = prompt('Tahun rilis baru:', book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = newYear;
    saveBooks();
    renderBooks();
  }
}

function searchBook() {
  const query = document.getElementById('searchBookTitle').value;
  renderBooks(query);
}

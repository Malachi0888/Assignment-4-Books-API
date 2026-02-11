const express = require("express");

const app = express();
app.use(express.json());

const initialBooks = [
  {
    id: 1,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    available: true
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    available: false
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    available: true
  }
];

let books = initialBooks.map((book) => ({ ...book }));

function resetBooks() {
  books = initialBooks.map((book) => ({ ...book }));
}

app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  return res.status(200).json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author, genre, available } = req.body;
  const newId =
    books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

  const newBook = {
    id: newId,
    title,
    author,
    genre,
    available
  };

  books.push(newBook);
  return res.status(201).json(newBook);
});

app.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author, genre, available } = req.body;
  book.title = title;
  book.author = author;
  book.genre = genre;
  book.available = available;

  return res.status(200).json(book);
});

app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(bookIndex, 1);
  return res.status(200).json({ message: "Book deleted successfully" });
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = {
  app,
  resetBooks
};

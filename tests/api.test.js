const request = require("supertest");
const { app, resetBooks } = require("../server");

describe("Books API", () => {
  beforeEach(() => {
    resetBooks();
  });

  describe("GET /api/books", () => {
    test("returns all books", async () => {
      const response = await request(app).get("/api/books");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });
  });

  describe("GET /api/books/:id", () => {
    test("returns one book when ID exists", async () => {
      const response = await request(app).get("/api/books/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 1,
          title: "Dune"
        })
      );
    });

    test("returns 404 when ID does not exist", async () => {
      const response = await request(app).get("/api/books/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Book not found" });
    });
  });

  describe("POST /api/books", () => {
    test("creates a new book", async () => {
      const newBook = {
        title: "Foundation",
        author: "Isaac Asimov",
        genre: "Science Fiction",
        available: true
      };

      const response = await request(app).post("/api/books").send(newBook);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 4,
          ...newBook
        })
      );

      const allBooks = await request(app).get("/api/books");
      expect(allBooks.body).toHaveLength(4);
    });
  });

  describe("PUT /api/books/:id", () => {
    test("updates an existing book", async () => {
      const updatedBook = {
        title: "Dune Messiah",
        author: "Frank Herbert",
        genre: "Science Fiction",
        available: false
      };

      const response = await request(app).put("/api/books/1").send(updatedBook);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        ...updatedBook
      });
    });

    test("returns 404 when updating missing book", async () => {
      const response = await request(app).put("/api/books/999").send({
        title: "Unknown",
        author: "Unknown",
        genre: "Unknown",
        available: false
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Book not found" });
    });
  });

  describe("DELETE /api/books/:id", () => {
    test("deletes an existing book", async () => {
      const response = await request(app).delete("/api/books/2");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Book deleted successfully" });

      const allBooks = await request(app).get("/api/books");
      expect(allBooks.body).toHaveLength(2);
    });

    test("returns 404 when deleting missing book", async () => {
      const response = await request(app).delete("/api/books/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Book not found" });
    });
  });
});

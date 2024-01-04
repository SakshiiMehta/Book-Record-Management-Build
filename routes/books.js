const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

/*
 *Route:/books
 *Method:GET
 *Description: Getting all books
 *Access: Public
 *Parameters: none
 */

router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Got all the books", data: books });
});

/*
 *Route:/books
 *Method:GET
 *Description: Getting all books by ID
 *Access: Public
 *Parameters: ID
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Found the book by their ID",
    data: book,
  });
});

/*
 *Route:/books/issued
 *Method:GET
 *Description: Getting all issued books
 *Access: Public
 *Parameters: none
 */

router.get("/issued", (req, res) => {
  const usersWithTheIssuedBook = users.filter((each) => {
    //Filter is used instead of find when we want to return more than 1 element
    if (each.issuedBook) return each;
  });
  const issuedBooks = []; // New array created to store all the issued books user details

  usersWithTheIssuedBook.forEach((each) => {
    const book = books.find((book) => book.id === each.issuedBook); //If issued Book is same as the ID then the info is coorect and we have not received any junk values

    book.issuedBy = each.name; // need issued by info from the element name
    book.issueydDate = each.issuedDate;
    book.returnDate = each.returnDate;

    issuedBooks.push(book);
  });
  if (issuedBooks.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No book have been issued yet",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Users with the issued books",
    data: issuedBooks,
  });
});

/*
 *Route: /
 *Method:POST
 *Description: Adding a new book
 *Access: Public
 *Parameters: ID
 *Data: id, name,author, genre, price, publisher,
 */
router.post("/", (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "No data provided to add a book",
    });
  }

  const book = books.find((each) => each.id === data.id);

  if (book) {
    return res.status(404).json({
      success: false,
      message: "Book with the given ID already exists",
    });
  }

  const allBooks = [...books, data];
  return res.status(200).json({ success: true, data: allBooks });
});

/**
 * Route: /books/:id
 * Method: PUT
 * Decsription: Update a Bookk By Its ID
 * Access: Public
 * Paramaters: Id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const book = books.find((each) => each.id === id);

  if (!book) {
    return res.status(400).json({
      success: false,
      message: "Book with the given Id doesn't exist",
    });
  }

  const updatedBook = books.map((each) => {
    //
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    data: updatedBook,
  });
});

module.exports = router;

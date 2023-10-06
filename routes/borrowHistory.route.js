const express = require("express");

const { BookModel } = require("../models/book.model");
const { BorrowHistoryModel } = require("../models/borrowHistory.model");
const { authentication } = require("../middleware/authentication");

const borrowRouter = express.Router();

borrowRouter.post("/borrow/:bookId", authentication, async (req, res) => {
  try {
    const userId = req.body.userId;
    const bookId = req.params.bookId;

    const borrowedBooksCount = await BorrowHistoryModel.find({
      userId,
      returnDate: null,
    });
    // console.log(borrowedBooksCount.length);
    if (borrowedBooksCount.length >= 3) {
      return res.status(400).send({
        message: "You have reached the maximum limit for borrowed books.",
      });
    }

    const book = await BookModel.findById(bookId);
    if (!book || book.quantity <= 0) {
      return res
        .status(404)
        .json({ message: "Book not found or not available for borrowing." });
    }
    const borrowRecord = new BorrowHistoryModel({
      userId,
      bookId,
      borrowedDate: new Date(),
      returnDate: null,
    });

    book.quantity--;
    await book.save();
    await borrowRecord.save();
    res.send({ message: "You just borrowed a book" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

borrowRouter.post("/return/:borrowId", authentication, async (req, res) => {
  try {
    const borrowId = req.params.borrowId;
    const userId = req.body.userId;
    // console.log(borrowId);
    // console.log(userId);

    const borrowRecord = await BorrowHistoryModel.findOne({
      _id: borrowId,
      userId: userId,
    });

    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrowing record not found." });
    }

    borrowRecord.returnDate = new Date();
    await borrowRecord.save();

    const book = await BookModel.findById(borrowRecord.bookId);
    if (book) {
      book.quantity++;
      await book.save();
    }
    res.send({ message: "Book returned successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

borrowRouter.get("/recommendations", authentication, async (req, res) => {
  const userId = req.body.userId;

  const userBorrowedBooks = await BorrowHistoryModel.find({
    userId,
    returnDate: { $ne: null },
  });
  console.log(userBorrowedBooks);

  const bookIds = userBorrowedBooks.map((el) => {
    return el.bookId;
  });
  const borrowedBooksAuthors = await BookModel.distinct("author", {
    _id: { $in: bookIds },
  });
  // res.send(borrowedBooksAuthors);["H C Verma","Vikas Rahi"]

  const recommendedBooks = await BookModel.find({
    author: { $in: borrowedBooksAuthors },
  });
  res.json(recommendedBooks);
});

module.exports = { borrowRouter };

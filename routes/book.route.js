const express = require("express");
const { BookModel } = require("../models/book.model");
const { authentication } = require("../middleware/authentication");
const bookRouter = express.Router();

bookRouter.post("/add", authentication, async (req, res) => {
  const payload = req.body;
  try {
    const existingBook = await BookModel.findOne({ ISBN: payload.ISBN });
    if (existingBook) {
      existingBook.quantity += payload.quantity;
      await existingBook.save();
      res.send({ message: "Quantity updated" });
    } else {
      const book = new BookModel(payload);
      await book.save();
      res.send({ message: "Book added" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

bookRouter.put("/update/:id", authentication, async (req, res) => {
  let id = req.params.id;
  const update = req.body;
  try {
    await BookModel.findByIdAndUpdate(id, update);
    res.send({ message: "Book Updated Sucessfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

bookRouter.delete("/delete/:id", authentication, async (req, res) => {
  let id = req.params.id;
  try {
    await BookModel.findByIdAndDelete(id);
    res.send({ message: "Book Removed Sucessfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

bookRouter.get("/get", async (req, res) => {
  try {
    const books = await BookModel.find({ isAvailable: true });
    return res.send(books);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

bookRouter.get("/search", async (req, res) => {
  const searchWord = req.query.q;
  try {
    const searchResults = await BookModel.find({
      $or: [
        { title: { $regex: searchWord, $options: "i" } },
        { author: { $regex: searchWord, $options: "i" } },
        { ISBN: { $regex: searchWord, $options: "i" } },
      ],
    });
    res.send(searchResults);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

module.exports = { bookRouter };

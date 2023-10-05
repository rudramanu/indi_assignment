const express = require("express");
const { BookModel } = require("../models/book.model");
const bookRouter = express.Router();

bookRouter.post("/add", async (req, res) => {
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
      res.send({ message: "Product added" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

bookRouter.put("/update/:id", async (req, res) => {
  let id = req.params.id;
  const update = req.body;
  try {
    await BookModel.findByIdAndUpdate(id, update);
    res.send({ message: "Product Updated Sucessfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

bookRouter.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await BookModel.findByIdAndDelete(id);
    res.send({ message: "Product Removed Sucessfully" });
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

module.exports = { bookRouter };

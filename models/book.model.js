const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  ISBN: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  quantity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

const BookModel = mongoose.model("book", bookSchema);

module.exports = { BookModel };

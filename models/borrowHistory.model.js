const mongoose = require("mongoose");

const borrowHistorySchema = mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  borrowedDate: { type: Date, required: true },
  returnDate: { type: Date },
});

const BorrowHistoryModel = mongoose.model("BorrowHistory", borrowHistorySchema);

module.exports = { BorrowHistoryModel };

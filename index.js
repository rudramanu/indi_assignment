const express = require("express");

const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.route");
const { bookRouter } = require("./routes/book.route");
const { borrowRouter } = require("./routes/borrowHistory.route");
const { apiLimiter } = require("./middleware/ratelimiter");
const { swaggerServe, swaggerSetup } = require("./config");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use("/home", (req, res) => {
  res.send("APIs are working");
});
app.use("/api-docs", swaggerServe, swaggerSetup);
app.use(apiLimiter);
app.use("/user", userRouter);
app.use("/book", bookRouter);
app.use("/history", borrowRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error while connecting with Database");
  }
  console.log(`Server is running at port ${process.env.port}`);
});

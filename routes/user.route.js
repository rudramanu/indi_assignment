const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../models/user.model");

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(409).send({ message: "Please provide all fields" });
  }
  let check_existence = await UserModel.findOne({ email });
  if (check_existence) {
    return res.status(409).send({ message: "User Already Present" });
  }
  try {
    bcrypt.hash(password, 3, async (err, encrypted) => {
      if (err) {
        res.status(404).send({ message: "Getting Error" });
      } else {
        const user = new UserModel({
          name,
          email,
          password: encrypted,
        });
        await user.save();
        res.status(200).send({ message: "User Registered" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error while registering" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(409)
      .send({ message: "Provide email and password to login" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const hashed_password = user.password;
    bcrypt.compare(password, hashed_password, (err, result) => {
      if (err) {
        return res.status(404).send({ message: err.message });
      } else if (result) {
        const token = jwt.sign({ userId: user._id, email }, process.env.key);
        res
          .status(200)
          .send({ message: "Logged in successfully", name: user.name, token });
      } else {
        res.status(403).send({ message: "Wrong credentials" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "User not found" });
  }
});

module.exports = { userRouter };

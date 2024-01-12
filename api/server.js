const express = require("express");
const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");
const User = require("./model/User");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();


// Connect to MongoDB
connectDB();

// app.use(cors());

require("dotenv").config();
const app = express();

// add localhost in cors
app.use(cors({ origin: "http://localhost:5173" }));


// Routes

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the authentication server");
});

app.use("/api/todos", todoRoutes);

app.post("/Login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user._id }, "1234", {
            expiresIn: "1h", // Token expiry time
          });
          res.send({ message: "Login Successful", user: user, token: token });
        } else {
          res.send({ message: "Password didn't match" });
        }
      });
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/Register", (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          res.send(err);
        } else {
          const newUser = new User({
            username,
            email,
            password: hashedPassword,
          });
          newUser.save((err) => {
            if (err) {
              res.send(err);
            } else {
              res.send({ message: "Successfully Registered" });
            }
          });
        }
      });
    }
  });
});

const PORT = 6969;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

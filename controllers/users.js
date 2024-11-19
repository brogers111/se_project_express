const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  DUPLICATE,
  handleError,
} = require("../utils/errors");

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        handleError(err, res, BAD_REQUEST);
      } else if (err.code === 11000) {
        res.status(DUPLICATE).send({ message: "Email already exists." });
      } else {
        handleError(err, res, SERVER_ERROR);
      }
    });
};

// Login user
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(BAD_REQUEST).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      handleError(err, res, SERVER_ERROR);
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name and avatar are required" });
  }

  return User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      return User.findByIdAndUpdate(
        req.user._id,
        { name: req.body.name, avatar: req.body.avatar },
        { new: true, runValidators: true }
      )
        .then((updatedUser) => {
          res.status(200).send(updatedUser);
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return res.status(BAD_REQUEST).send({ message: err.message });
          }
          return handleError(err, res, SERVER_ERROR);
        });
    })
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

module.exports = { createUser, login, getCurrentUser, updateProfile };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");

// POST /users
const createUser = (req, res, next) => {
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
        next(new BadRequestError("Invalid data provided for user creation"));
      } else if (err.code === 11000) {
        next(new ConflictError("Email already exists"));
      }
      next(err);
    });
};

// Login user
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The email and password fields are required")
    );
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  if (!name || !avatar) {
    return next(new BadRequestError("Name and avatar are required"));
  }

  return User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError("User not found");
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided for updating profile"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };

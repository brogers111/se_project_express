const User = require("../models/user");
const {
  BAD_REQUEST,
  SERVER_ERROR,
  handleError,
  throwNotFoundError,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        handleError(err, res, BAD_REQUEST);
      } else {
        handleError(err, res, SERVER_ERROR);
      }
    });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => throwNotFoundError("User not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

module.exports = { getUsers, createUser, getUser };

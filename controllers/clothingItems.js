const Item = require("../models/clothingItem");
const {
  BAD_REQUEST,
  SERVER_ERROR,
  handleError,
  throwNotFoundError,
} = require("../utils/errors");

// GET /items
const getItems = (req, res) => {
  Item.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

// POST /items
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        handleError(err, res, BAD_REQUEST);
      } else {
        handleError(err, res, SERVER_ERROR);
      }
    });
};

// DELETE /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail(() => throwNotFoundError("Item not found"))
    .then(() => res.status(200).send({ message: "Item successfully deleted" }))
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => throwNotFoundError("Item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => throwNotFoundError("Item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => handleError(err, res, SERVER_ERROR));
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };

const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Routes that don't require auth
router.get("/", getItems);

// Routes that require auth
router.post("/", auth, validateClothingItemBody, createItem);
router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;

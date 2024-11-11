const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

// Fallback route for non-existent resources
router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;

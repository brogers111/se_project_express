const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND, handleError } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  handleError({ statusCode: NOT_FOUND }, res, NOT_FOUND);
});

module.exports = router;

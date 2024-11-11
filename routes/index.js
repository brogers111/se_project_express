const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { NOT_FOUND, handleError } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  handleError({ statusCode: NOT_FOUND }, res, NOT_FOUND);
});

module.exports = router;

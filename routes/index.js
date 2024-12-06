const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  validateUserInfoBody,
  validateLogin,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errors");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserInfoBody, createUser);

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;

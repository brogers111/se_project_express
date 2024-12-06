const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserUpdateBody } = require("../middlewares/validation");

// Routes that require auth
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdateBody, updateProfile);

module.exports = router;

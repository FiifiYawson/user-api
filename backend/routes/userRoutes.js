const express = require("express");
const { registerUser, loginUser, deleteUser } = require("../controllers/userController");
const validate = require("../middleware/validator");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/").post(loginUser).delete(validate, deleteUser);

module.exports = router;
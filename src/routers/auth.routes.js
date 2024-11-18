const router = require("express").Router();
const {
  login,
  register,
  me,
  forgetPassword,
} = require("../controller/auth.controller");
const authValidation = require("../middlewares/validations/auth.validations");
const { tokenCheck } = require("../middlewares/auth");

router.post("/login", authValidation.login, login);
router.post("/register", authValidation.register, register);

router.post("/forget-password", forgetPassword);

router.get("/me", tokenCheck, me);

module.exports = router;

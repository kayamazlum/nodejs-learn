const router = require("express").Router();
const { login, register } = require("../controller/auth.controller");
const authValidation = require("../middlewares/validations/auth.validations");

router.post("/login", authValidation.login, login);
router.post("/register", authValidation.register, register);

module.exports = router;

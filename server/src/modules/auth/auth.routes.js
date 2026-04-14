const router = require("express").Router();
const authController = require("./auth.controller");
const { validateRegister, validateLogin } = require("./auth.validator");
const authenticate = require("../../middleware/authenticate");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);

module.exports = router;

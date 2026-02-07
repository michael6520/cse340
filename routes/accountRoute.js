// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.login))
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.processLogin)
)
router.get("/register", utilities.handleErrors(accountController.register))
// Process the registration data
router.post(
    '/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const validator = require("../utilities/testdrive-validation")
const testdriveCont = require("../controllers/testdriveController")

router.get(
    "/request",
    utilities.checkLogin,
    utilities.handleErrors(testdriveCont.buildRequest))
router.post(
    "/request",
    utilities.checkLogin,
    validator.addRequestRules(),
    validator.checkRequestData,
    utilities.handleErrors(testdriveCont.sendRequest)
)

module.exports = router
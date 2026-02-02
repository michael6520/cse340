// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const errController = require("../controllers/errController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInventoryId))
router.get("/trigger-error", utilities.handleErrors(errController.triggerError))

module.exports = router;
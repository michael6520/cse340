// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const errController = require("../controllers/errController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInventoryId))
router.get("/trigger-error", utilities.handleErrors(errController.triggerError))
router.get("/management", utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.handleErrors(invController.addClassificationPage))
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)
router.get("/add-inventory", utilities.handleErrors(invController.addInventoryPage))
router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;
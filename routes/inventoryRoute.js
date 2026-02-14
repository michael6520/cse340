// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInventoryId))
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
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))
router.post(
    "/edit-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;
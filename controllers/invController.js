const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildDetailByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getModelByInventoryId(inv_id)
  const detailHTML = utilities.buildInventoryDetail(vehicle)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    vehicle,
    detailHTML,
    nav,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect
  })
}

invCont.addClassificationPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const result = await invModel.insertClassification(classification_name)

    if (result) {
      req.flash("notice", `Classification "${classification_name}" added successfully.`)
      nav = await utilities.getNav()
      return res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null
      })
    }

    req.flash("notice", "Failed to add classification.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name,
      errors: null
    })
  } catch (error) {
    // DB error
    console.error(error)
    req.flash("notice", "An error occurred while adding classification.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name,
      errors: null
    })
  }
}

invCont.addInventoryPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classification = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classification,
    errors: null
  })
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const classification = await utilities.buildClassificationList(req.body.classification_id);

  try {
    const result = await invModel.insertInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });

    if (result) {
      req.flash("notice", `"${inv_make} ${inv_model}" added successfully.`)
      return res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null,
        classificationSelect: classification
      })
    }

    req.flash("notice", "Failed to add inventory.")
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      ...req.body,
      classification,
      errors: null
    })
  } catch (error) {
    // DB error
    console.error(error)
    req.flash("notice", "An error occurred while adding inventory.")
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      ...req.body,
      classification,
      errors: null
    })
  }
}

invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = req.params.classification_id
  const inventoryData = await invModel.getInventoryByClassificationId(classification_id)
  res.json(inventoryData)
}

invCont.buildEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getModelByInventoryId(inv_id)
  const classification_id = itemData.classification_id
  let classificationSelect = await utilities.buildClassificationList(classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteConfimationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getModelByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete a car from the database
 * ************************** */
invCont.obliterateCar = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.body.inv_id
  const itemData = await invModel.getModelByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const deleteResult = await invModel.vaporizeCar(inv_id)

  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
    })
  }
}

module.exports = invCont
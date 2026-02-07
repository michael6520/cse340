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
  res.render("./inventory/management", {
    title: "Management",
    nav
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
        errors: null
      })
    }

    req.flash("notice", "Failed to add classification.")
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

module.exports = invCont
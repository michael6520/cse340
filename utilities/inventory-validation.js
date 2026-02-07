const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

validate.addClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("Classifiction name is required.")
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification name may only contain letters.")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name: req.body.classification_name
        })
    }
    next()
}

validate.addInventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .notEmpty()
        .withMessage("Make is required."),

        body("inv_model")
        .trim()
        .notEmpty()
        .withMessage("Model is required."),

        body("inv_year")
        .notEmpty()
        .withMessage("Year is required.")
        .isInt()
        .withMessage("Enter a valid year"),

        body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Path to image is required."),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Path to thumbnail is required."),

        body("inv_price")
        .notEmpty()
        .withMessage("Price is required.")
        .isFloat({ min: 0 })
        .withMessage("Enter a valid price."),

        body("inv_miles")
        .notEmpty()
        .withMessage("Milage is required.")
        .isInt({ min: 0 })
        .withMessage("Enter a valid mileage."),

        body("inv_color")
        .trim()
        .notEmpty()
        .withMessage("Color is required."),

        body("classification_id")
        .notEmpty()
        .withMessage("Classification is required.")
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classification = await utilities.buildClassificationList(req.body.classification_id)
        return res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classification,
            errors,
            ...req.body
        })
    }
    next()
}

module.exports = validate
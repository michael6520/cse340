const { body, validationResult } = require("express-validator")
const utilities = require('.')
validator = {}

validator.addRequestRules = () => {
  return [
    // Vehicle must be selected and be an integer
    body("inv_id")
      .exists({ checkFalsy: true })
      .withMessage("You must select a vehicle.")
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle selected."),

    // Date must exist and be today or in the future
    body("requested_date")
      .exists({ checkFalsy: true })
      .withMessage("Please select a date for your test drive.")
      .isISO8601()
      .withMessage("Invalid date format. Please use YYYY-MM-DD.")
      .custom((value) => {
        const today = new Date()
        const selected = new Date(value)
        selected.setHours(0,0,0,0)
        today.setHours(0,0,0,0)
        if (selected < today) {
          throw new Error("Date must be today or later.")
        }
        return true
      }),

    // Time must exist
    body("requested_time")
      .exists({ checkFalsy: true })
      .withMessage("Please select a time for your test drive.")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid time format (HH:MM)."),
  ];
}

validator.checkRequestData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    console.log("ERROR IN VALIDATION")
    return res.render("testdrive/request", {
      title: "Request a Test Drive",
      nav,
      inv_id: inv_id,
      requested_date: requested_date,
      requested_time: requested_time
    })
  }

  next()
}

module.exports = validator
const testdriveModel = require("../models/testdrive-model")
const utilities = require("../utilities/")
const testdrive = {}

testdrive.buildRequest = async (req, res, next) => {
  try {
    let nav = await utilities.getNav()
    const vehicles = await testdriveModel.getAllVehicles()

    let models = '<select name="inv_id" id="inv_id" required>'
    models += '<option value="">-- Select a Vehicle --</option>'
    vehicles.forEach(vehicle => {
      const selected = res.locals.inv_id == vehicle.inv_id ? ' selected' : ''
      models += `<option value="${vehicle.inv_id}"${selected}>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</option>`
    })
    models += '</select>'

    res.render("testdrive/request", {
      title: "Request a Test Drive",
      nav,
      models
    })
  } catch (error) {
    next(error)
  }
}

testdrive.sendRequest = async (req, res, next) => {
  try {
    const { inv_id, requested_date, requested_time } = req.body

    const account_id = res.locals.accountData.account_id

    await testdriveModel.addRequest(account_id, inv_id, requested_date, requested_time)

    req.flash("notice", "Your test drive request has been submitted successfully")
    res.redirect("/")

  } catch (error) {
    next(error)
  }
}

module.exports = testdrive
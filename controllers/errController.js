const errCont = {}

errCont.triggerError = async (req, res, next) => {
    throw new Error("Test Error 500")
}

module.exports = errCont
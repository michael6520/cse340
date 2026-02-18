const pool = require("../database/")
const testdrive = {}

testdrive.getAllVehicles = async () => {
  const sql = "SELECT inv_id, inv_make, inv_model, inv_year FROM inventory ORDER BY inv_make, inv_model"
  const result = await pool.query(sql)
  return result.rows
}

testdrive.addRequest = async (account_id, inv_id, requested_date, requested_time) => {
  const sql = `
    INSERT INTO public.testdrive (account_id, inv_id, requested_date, requested_time)
    VALUES ($1, $2, $3, $4)
    RETURNING request_id
  `
  const values = [account_id, inv_id, requested_date, requested_time]
  const result = await pool.query(sql, values)
  return result.rows[0]
}

module.exports = testdrive
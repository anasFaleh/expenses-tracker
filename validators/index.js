const { userSchema, loginSchema,  passwordSchema, userUpdateSchema, adminUpdateSchema } = require('./user')
const { categorySchema } = require('./category')
const { expenseSchema, expenseUpdateSchema } = require('./expense')
const { validateIncome, validateIncomeUpdate } = require('./income')


module.exports = {
    userSchema,
    loginSchema,
    adminUpdateSchema,
    passwordSchema,
    userUpdateSchema,
    categorySchema,
    expenseSchema,
    expenseUpdateSchema,
    validateIncome,
    validateIncomeUpdate
}
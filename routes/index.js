const {userRouter, adminRouter} = require('./user')
const {authRouter} = require('./auth')
const { categoryRouter } = require('./category')
const { expenseRouter } = require('./expense')
const  incomeRouter  = require('./Income')



module.exports = (app) => {
app.use('/api/v1/user', userRouter),
app.use('/api/v1/auth', authRouter),
app.use('/api/v1/admin', adminRouter),
app.use('/api/v1/category', categoryRouter),
app.use('/api/v1/expense', expenseRouter),
app.use('/api/v1/income', incomeRouter)

}
const { Router } = require('express')
const { authMiddelware } = require('../middelwares')
const { expenseController } = require('../controller')

const expenseRouter = Router()

expenseRouter
    .post('/create', authMiddelware.protect, expenseController.createExpense)
    .put('/update/:id', authMiddelware.protect, expenseController.updateExpense)
    .delete('/delete/:id', authMiddelware.protect, expenseController.deleteExpense)
    .get('/getExpenses', authMiddelware.protect, expenseController.getExpenses)
    .get('/getTotalExpenses', authMiddelware.protect, expenseController.getTotalExpenses)
    .get('/getAverageExpenses', authMiddelware.protect, expenseController.getAverageExpenses)



    module.exports = {
        expenseRouter
    }
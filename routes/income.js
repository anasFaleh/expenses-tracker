const { Router } = require('express')
const { authMiddelware } = require('../middelwares')
const { incomeController } = require('../controller')
const incomeRouter = Router()

incomeRouter
    .post('/create', authMiddelware.protect, incomeController.createIncome)
    .put('/update/:id', authMiddelware.protect, incomeController.updateIncome)
    .delete('/delete/:id', authMiddelware.protect, incomeController.deleteIncome)
    .get('/getIncomes', authMiddelware.protect, incomeController.getIncomes)
    .get('/getTotalIncome', authMiddelware.protect, incomeController.totalIncome)
    .get('/getAverageIncome', authMiddelware.protect, incomeController.AverageIncome)


module.exports = incomeRouter
const { Router } = require('express')
const { authMiddelware } = require('../middelwares')
const { categoryController } = require('../controller')
const categoryRouter = Router()

categoryRouter
    .post('/add', authMiddelware.protect, categoryController.createCategory)
    .patch('/update/:id', authMiddelware.protect, categoryController.updateCategory)
    .delete('/delete/:id', authMiddelware.protect, categoryController.deleteCategory)
    .get('/get', authMiddelware.protect, categoryController.getCategories)
    .patch('/disActive/:id', authMiddelware.protect, categoryController.disActive)
    .patch('/Active/:id', authMiddelware.protect, categoryController.Active)

    module.exports = {
        categoryRouter
    }
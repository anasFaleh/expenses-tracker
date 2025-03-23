const { Router } = require('express')
const { userController } = require('../controller')
const { authMiddelware } = require('../middelwares')

const userRouter = Router()
const adminRouter = Router()

userRouter
    .get('/profile', authMiddelware.protect, userController.getUserProfile)
    .patch('/updateProfile', authMiddelware.protect, userController.updateUserProfile)
    .delete('/deleteMe', authMiddelware.protect, userController.deleteMe)
    .patch('/changePassword', authMiddelware.protect, userController.changePassword)


adminRouter
    .get('/getUsers', authMiddelware.protect, authMiddelware.restrictTo('admin'), userController.getUsers)
    .delete('/deleteUser/:id', authMiddelware.protect, authMiddelware.restrictTo('admin'), userController.deleteUser)
    .patch('/UpdateUserProfile/:id', authMiddelware.protect, authMiddelware.restrictTo('admin'), userController.updateUserInfo)
    .patch('/changePassword/:id', authMiddelware.protect, authMiddelware.restrictTo('admin'), userController.changeUserPassword)

module.exports = {
    userRouter,
    adminRouter
}
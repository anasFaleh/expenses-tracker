const { Router } = require('express')
const { authController } = require('../controller')
const { authMiddelware } = require('../middelwares')

const authRouter = Router()

authRouter
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .post('/logout', authMiddelware.protect, authController.logout)

module.exports = { authRouter }
const joi = require('joi');

const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phoneNumber: joi.string(),
    profileImage: joi.string(),
    isActive: joi.boolean(),
    wallet: joi.number().min(0)
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})

const userUpdateSchema = joi.object({
    name: joi.string(),
    email: joi.string().email(),
    phoneNumber: joi.string(),
    profileImage: joi.string(),
    wallet: joi.number().min(0)
}).min(1)

const adminUpdateSchema = joi.object({
    name: joi.string(),
    email: joi.string().email(),
    phoneNumber: joi.string(),
    role: joi.string().valid('admin', 'user'),
    profileImage: joi.string(),
    wallet: joi.number().min(0)
}).min(1)

const passwordSchema = joi.object({
    newPassword: joi.string().min(6).required()
}).min(1)


module.exports = {
    userSchema,
    loginSchema,
    adminUpdateSchema,
    passwordSchema,
    userUpdateSchema
}
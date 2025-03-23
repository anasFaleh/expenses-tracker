const { User } = require('../models');
const asyncHandler = require('express-async-handler')
const { adminUpdateSchema, userUpdateSchema, passwordSchema } = require('../validators')
const createError = require('http-errors')
const mongoose = require('mongoose')


// @desc    Get all users
// @route   Get /api/v1/user/getUsers
// @access  Admin

exports.getUsers = asyncHandler(async (req, res, next) => {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).select('-password -__v -_id');
    if (!users) {
        return next(createError(404, 'No users found'))
    }

    return returnJson(res, 200, true, 'Users fetched successfully', users);

})



// @desc    Get user profile
// @route   Get /api/v1/user/profile
// @access  Private

exports.getUserProfile = asyncHandler(async (req, res, next) => {
    const id = req.user.id
    const user = await User.findById(id).select('name email role phoneNumber wallet -_id');
    if (!user) {
        return next(createError(404, 'User not found'))
    }
    return returnJson(res, 200, true, 'User fetched successfully', user);
})



// @desc    Update user profile
// @route   PATCH /api/v1/user/UpdateProfile
// @access  Private


exports.updateUserProfile = asyncHandler(async (req, res, next) => {

    const id = req.user.id
    const updatedUser = req.body

    const { error } = userUpdateSchema.validate(updatedUser)

    if (error) {
        error.isJoi = true
        return next(error)
    }

    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true, runValidators: true  }).select('name email role phoneNumber wallet -_id')

    if (!user) {
        return next(createError(404, 'User not found'))
    }

    return returnJson(res, 200, true, 'User updated successfully', user)
})



// @desc    Update user profile
// @route   PATCH /api/v1/user/UpdateUserProfile/:id
// @access  Admin




exports.updateUserInfo = asyncHandler(async (req, res, next) => {

    const userId = req.params.id
    const updatedUser = req.body

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(createError(400, 'Invalid user id'))
        }

        const { error } = adminUpdateSchema.validate(updatedUser)
        if(error){
            error.isJoi = true
            return next(error)
        }

        const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true, runValidators: true }).select('name email role phoneNumber wallet -_id')
        if (!user) {
            return next(createError(404, 'User not found'))
        }

        return returnJson(res, 200, true, 'User updated successfully', user)
        
})






// @desc    Delete user account
// @route   DELETE /api/v1/user/deleteMe
// @access  Private

exports.deleteMe = asyncHandler(async (req, res, next) => {
    const id = req.user.id
    console.log(id)
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
        return next(createError(404, 'User not found'))
    }
    return returnJson(res, 200, true, 'User deleted successfully', null)
})


// @desc    Delete user account
// @route   DELETE /api/v1/user/deleteUser/:id
// @access  Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {

    const userId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(createError(400, 'Invalid user id'))
    }

    const deleted = await User.findByIdAndDelete(userId)

    if (!deleted) {
        return next(createError(404, 'User not found'))
    }

    return returnJson(res, 200, true, 'User deleted successfully', null)
})


// @desc    Change user password
// @route   PATCH /api/v1/user/changePassword
// @access  Private

exports.changePassword = asyncHandler(async (req, res, next) => {
    const id = req.user.id
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(id)
    if (!user) {
        return next(createError(404, 'User not found'))
    }

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
        return next(createError(401, 'Invalid credentials'))
    }

    const { error } = passwordSchema.validate({ newPassword })
    if (error) {
        error.isJoi = true
        return next(error)
    }

    user.password = newPassword
    await user.save()

    return returnJson(res, 200, true, 'Password changed successfully', null)
})


// @desc    Change user password
// @route   PATCH /api/v1/user/changePassword/:id
// @access  Private

exports.changeUserPassword = asyncHandler(async (req, res, next) => {

    const userId = req.params.id
    const { newPassword } = req.body

    if (!mongoose.isValidObjectId(userId)) {
        return next(createError(400, 'Invalid user id'))
    }

    const user = await User.findById(userId)
    if (!user) {
        return next(createError(404, 'User not found'))
    }

    
    const { error } = passwordSchema.validate({ newPassword })
    if (error) {
        error.isJoi = true
        return next(error)
    }

   

    user.password = newPassword
    await user.save()
    return returnJson(res, 200, true, 'Password changed successfully', null)


})
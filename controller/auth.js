const JWT = require('jsonwebtoken');
const { User } = require('../models');
const { userSchema, loginSchema } = require('../validators');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors')
const { BlacklistedToken } = require('../models');


// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public

exports.signup = asyncHandler(async (req, res, next) => {
    const userData = req.body;

    const { error } = userSchema.validate(userData);
    if (error) {
        error.isJoi = true;
        return next(error);
    }

    const { exists } = await userExists(userData.email);
    if (exists) {
        return next(createError(400, 'User already exists'));
    }

    const isFirstUser = (await User.countDocuments()) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({ ...userData, role });

    return returnJson(res, 201, true, 'User created successfully', user);
});




// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate user input
    const { error } = loginSchema.validate({ email, password });
    if (error) {
        error.isJoi = true;
        return next(error);
    }

    // Check if user exists
    const { exists, user } = await userExists(email);
    if (!exists) {
        return next(createError(400, 'Invalid credentials'));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(createError(401, 'Invalid credentials'));
    }

    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }

    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    return returnJson(res, 200, true, 'Login successful', { token });
});



// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private

exports.logout = asyncHandler(async (req, res, next) => {
    token = req.token
    expiresAt = new Date(req.exp);
    await BlacklistedToken.create({ token, expiresAt });
    return returnJson(res, 200, true, 'Logout successful', null);
})














// helpers

const userExists = asyncHandler(async (email) => {
    const user = await User.findOne({ email });
    return {
        exists: user ? true : false,
        user: user || null
    };
});

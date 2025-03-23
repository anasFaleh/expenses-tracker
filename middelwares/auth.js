const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { BlacklistedToken } = require('../models');

exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] 
try{
    
    if (!token) {
        return next(createError(401, 'Access denied. No token provided!'));
    }



    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
        return next(createError(401, 'Access denied. Token blacklisted!'));
    }

    
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token = token;
        req.exp = decoded.exp * 1000;
        next();

    }catch(err) {
        return next(createError(401, 'Invalid or expired token'));
    }
        
    
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log(req.user, roles) 
        if (!req.user || !roles.includes(req.user.role)) {
           return next(createError(403, 'You do not have permission to perform this action!'));
        }
        next();
    };
};




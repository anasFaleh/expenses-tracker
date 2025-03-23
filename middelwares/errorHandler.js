const createError = require('http-errors');

// Global error handler
module.exports = (app) => {
    // 1. Not found handler
    app.use((req, res, next) => {  
        next(createError(404, 'resorce Not found !'));
    });

    // 2. Global error handler
    app.use((err, req, res, next) => {
        if (err instanceof createError.HttpError) {
            return returnJson(res, err.statusCode || 500, false, err.message || 'Something went wrong!', err.details || null);
        }

        if (err.isJoi) {
            return returnJson(res, 400, false, 'Invalid data provided', err.details[0].message || 'Invalid data provided');
        }

        // Fallback for other errors
        return returnJson(res, 500, false, err.stack || 'Internal Server Error', null);
    });
}



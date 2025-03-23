const { Expense, Category, User } = require('../models')
const asyncHandler = require('express-async-handler')
const createError = require('http-errors')
const { expenseSchema, expenseUpdateSchema } = require('../validators')
const mongoose = require('mongoose')
const { ObjectId } = require('bson')


// @desc    Create expense
// @route   POST /api/v1/expense/create
// @access  Private


exports.createExpense = asyncHandler(async (req, res, next) => {
    const data = req.body
    const userId = req.user.id
    const categoryId = req.body.category

    if (mongoose.isValidObjectId(categoryId) === false) {
        return next(createError(400, 'invalid category id'))
    }

    const category = await Category.findById(categoryId)
    if(!category){
        return next(createError(404, 'category not found'))
    }

    const { error } = expenseSchema.validate(data)
    if (error) {
        error.isJoi = true
        return next(error)
    }


    const user = await User.findById(userId)
    if (!user) {
        return next(createError(404, 'User not found'))
    }

    if (user.wallet < data.amount) {
        return next(createError(400, 'Insufficient funds in wallet'))
    }

    user.wallet -= data.amount;

    await user.save();

    const expenseData = { ...data, user: userId };
    const expense = await Expense.create(expenseData)

    return returnJson(res, 201, true, 'expense created successfully', expense)


})


// @desc    Update expense
// @route   PATCH /api/v1/expense/update/:id
// @access  Private

exports.updateExpense = asyncHandler(async (req, res, next) => {
    const updatedExpense = req.body
    const expenseId = req.params.id
    const userId = req.user.id
    

    if (!mongoose.isValidObjectId(expenseId)) {
        return next(createError(400, 'Invalid expense ID'))
    }

    const { error } = expenseUpdateSchema.validate(updatedExpense)
    if (error) {
        error.isJoi = true
        return next(error)
    }

    const expense = await Expense.findById(expenseId)
    if (!expense) {
        return next(createError(404, 'Expense not found'))
    }

    const user = await User.findById(userId)
    if (!user) {
        return next(createError(404, 'User not found'))
    }

    if (expense.user.toString() !== userId) {
        return next(createError(401, 'Unauthorized'))
    }

    const amount = updatedExpense.amount
    if(amount){

    const amountDifference = Number(updatedExpense.amount) - Number(expense.amount);

    if (isNaN(amountDifference)) {
        return next(createError(400, "Invalid amount calculation"));
    }

    if (amountDifference > 0 && user.wallet < amountDifference) {
        return next(createError(400, 'Insufficient funds in wallet'))
    }

    user.wallet = Number(user.wallet) - amountDifference;
    await user.save();
}

    expense.amount = updatedExpense.amount || expense.amount;
    expense.description = updatedExpense.description || expense.description;
    expense.paymentMethod = updatedExpense.paymentMethod || expense.paymentMethod;
    expense.currency = updatedExpense.currency || expense.currency;

    const newExpense = await expense.save();

    return returnJson(res, 200, true, 'Expense Updated Successfully', newExpense);
});





// @desc    Delete expense
// @route   DELETE /api/v1/expense/delete/:id
// @access  Private

exports.deleteExpense = asyncHandler(async (req, res, next) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    if (mongoose.isValidObjectId(expenseId) === false) {
        return next(createError(400, 'invalid expenes id'))
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
        return next(createError(404, 'Expense not found'));
    }

    if (expense.user.toString() !== userId) {
        return next(createError(401, 'Unauthorized'));
    }

    await expense.deleteOne();

    return returnJson(res, 200, true, 'Expense deleted successfully', null);
});



// @desc    Get expense
// @route   Get /api/v1/expense/get
// @access  Private


exports.getExpenses = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    let { startDate, endDate, category } = req.query;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit)
    let filter = { user: userId }

    // Date filter
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (!isNaN(start) && !isNaN(end)) {
            filter.date = { $gte: start, $lte: end };
        } else {
            return next(createError(400, 'Invalid date format, use YYYY-MM-DD'));
        }
    }

    // Category filter
    if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
            filter.category = new mongoose.Types.ObjectId(category);
        } else {
            return next(createError(400, 'Invalid category ID'));
        }
    }
    const skip = (page - 1) * limit;

    const expenses = await Expense.find(filter)
        .limit(limit)
        .skip(skip)
        .select('-_id -user')
        .populate('category', 'name')

    if (expenses.length === 0) {
        return next(createError(404, 'No expenses found'));
    }


    return returnJson(res, 200, true, 'Expenses fetched successfully', expenses);
});




// @desc    Get expense total expenses
// @route   GET /api/v1/expenses/total
// @access  Private

exports.getTotalExpenses = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    let { startDate, endDate, category } = req.query;
    let filter = { user: new ObjectId(userId) };

    // Date filter
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (!isNaN(start) && !isNaN(end)) {
            filter.date = { $gte: start, $lte: end };
        } else {
            return next(createError(400, 'Invalid date format, use YYYY-MM-DD'));
        }
    }

    // Category filter
    if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
            filter.category = new mongoose.Types.ObjectId(category);
        } else {
            return next(createError(400, 'Invalid category ID'));
        }
    }


    const expenses = await Expense.find(filter);
    if (!expenses.length) {
        return next(createError(404, 'No expenses found'));
    }

    // aggregation
    const result = await Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);


    if (!result.length) {
        return next(createError(404, 'No expenses found'));
    }

    return returnJson(res, 200, true, 'Total', { totalAmount: result[0].totalAmount });
});



// @desc    Get average expenses
// @route   GET /api/v1/expenses/average
// @access  Private

exports.getAverageExpenses = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { startDate, endDate, category } = req.query;

    let filter = { user: new ObjectId(userId) };

    // Date filter
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (!isNaN(start) && !isNaN(end)) {
            filter.date = { $gte: start, $lte: end };
        } else {
            return next(createError(400, 'Invalid date format, use YYYY-MM-DD'));
        }
    }

    // category filter
    if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
            filter.category = new mongoose.Types.ObjectId(category);
        } else {
            return next(createError(400, 'Invalid category ID'));
        }
    }

    // aggregation
    const result = await Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, averageAmount: { $avg: "$amount" } } }
    ]);

    if (!result.length) {
        return next(createError(404, 'No expenses found'));
    }

    return returnJson(res, 200, true, 'Average', { averageAmount: result[0].averageAmount });
});



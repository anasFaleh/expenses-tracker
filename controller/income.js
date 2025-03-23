const { Income, User } = require('../models')
const createError = require('http-errors')
const asyncHandler = require('express-async-handler')
const { validateIncome, validateIncomeUpdate } = require('../validators')
const { default: mongoose } = require('mongoose')
const { ObjectId } = require('bson')




// @desc    Create income
// @route   Post /api/v1/income/create
// @access  Private


exports.createIncome = asyncHandler(async (req, res, next) => {
    const data = req.body
    const userId = req.user.id

    const { error } = validateIncome(data)
    if (error) {
        error.isJoi = true;
        return next(error)
    }

    const user = await User.findById(userId)
    if (!user){
        return next(createError(404, 'User not found'))
    }



    const incomeData = { ...data, user: userId }
    const income = await Income.create(incomeData)

    user.wallet += income.amount;
    await user.save();

    return returnJson(res, 201, true, 'Income created successfully', income)

})


// @desc    Update income
// @route   Put /api/v1/income/update/:id
// @access  Private


exports.updateIncome = asyncHandler(async (req, res, next) => {
    const data = req.body
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return next(createError(400, 'Invalid income id'))
    }

    const { error } = validateIncomeUpdate(data)
    if (error) {
        error.isJoi = true
        return next(error)
    }

    const income = await Income.findById(id)
    if (!income) {
        return next(createError(404, 'Income not found'))
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(createError(404, "User not found"));
    }

    const difference = updatedData.amount - income.amount;

    Object.keys(data).forEach((key) => {
        income[key] = data[key];
    });

    await income.save()

    user.wallet += difference;
    await user.save();
    
    return returnJson(res, 200, true, 'Income updated successfully', income)


})


// @desc    Delete income
// @route   Delete /api/v1/income/delete/:id
// @access  Private


exports.deleteIncome = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError(400, 'Invalid income id'))
    }

    const deletedIncome = await Income.findByIdAndDelete(id)
    if (!deletedIncome) {
        return next(createError(404, 'Income not found'))
    }

    return returnJson(res, 200, true, 'Income deleted successfully', deletedIncome)
})




// Reports

// @desc    Get incomes
// @route   /api/v1/income/getIncomes
// @access  Private


exports.getIncomes = asyncHandler( async(req, res, next) => {
    const userId = req.user.id
    const limit = Number(req.query.limit)
    const page = Number(req.query.page)

    const skip = (page - 1) * limit;

    const incomes = await Income.find({user: userId})
    .limit(limit)
    .skip(skip)
    .select('-__v -_id')


    if(incomes.length === 0){
        return next(createError(404, 'No incomes found'))
    }

    return returnJson(res, 200, true, 'Incomes fetched successfully',incomes)
})



// @desc    total income
// @route   Get /api/v1/income/getTotalIncome
// @access  Private

exports.totalIncome = asyncHandler(async (req, res, next) => {
    const { startDate, endDate, isRecurring, recurrenceType, source } = req.query
    const userId = req.user.id

    let filter = { user: new ObjectId( userId ) }

    // Date filter
    if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (!isNaN(start) && !isNaN(end)) {
            filter.date = { $gte: start, $lte: end };
        } else {
            return next(createError(400, 'Invalid date format, use YYYY-MM-DD'));
        }
    }

    // Recurring filter
    if (isRecurring !== undefined) {
        filter.isRecurring = isRecurring === 'true'; 
    }

    // RecurrenceType filter
    if (recurrenceType) {
        filter.recurrenceType = recurrenceType;
    }

    if (source){
        filter.source = source
    }


   // aggregation
       const result = await Income.aggregate([
           { $match: filter },
           { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
       ]);
   
   
       if (!result.length) {
           return next(createError(404, 'No Incomes found'));
       }
   
       return returnJson(res, 200, true, 'Total', { totalAmount: result[0].totalAmount });
})





// @desc    Average income
// @route   Get /api/v1/income/getAverageIncome
// @access  Private

exports.AverageIncome = asyncHandler(async (req, res, next) => {
    const { startDate, endDate, isRecurring, recurrenceType, source } = req.query
    const userId = req.user.id

    let filter = { user: new ObjectId(userId) }

    // Date filter
    if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (!isNaN(start) && !isNaN(end)) {
            filter.date = { $gte: start, $lte: end };
        } else {
            return next(createError(400, 'Invalid date format, use YYYY-MM-DD'));
        }
    }

    // Recurring filter
    if (isRecurring !== undefined) {
        filter.isRecurring = isRecurring === 'true'; 
    }

    // RecurrenceType filter
    if (recurrenceType) {
        filter.recurrenceType = recurrenceType;
    }

    if (source){
        filter.source = source
    }


   // aggregation
       const result = await Income.aggregate([
           { $match: filter },
           { $group: { _id: null, Average: { $avg: "$amount" } } }
       ]);
   
   
       if (!result.length) {
           return next(createError(404, 'No Incomes found'));
       }
   
       return returnJson(res, 200, true, 'Average', { Average: result[0].Average });
})
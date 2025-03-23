const createError = require('http-errors');
const { Category } = require('../models');
const { categorySchema } = require('../validators');
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')



// @desc    Add category
// @route   POST /api/v1/category/add
// @access  Private


exports.createCategory = asyncHandler(async (req, res, next) => {
    const userId = req.user.id
    const{ name } = req.body;
    const { error } = categorySchema.validate({ name })

    if (error) {

        error.isJoi = true;
        return next(error);
    }


    const existingCategory = await Category.findOne({ name, userId: userId });
    if (existingCategory) {
        return next(createError(400, 'category already exists'));
    }

    const newCategory =  await Category.create({ name, userId: userId })

    return returnJson(res, 201, true, 'Category created successfully', {
        name: newCategory.name,
        userId: newCategory.userId,
        createdAt: newCategory.createdAt 
    });
})



// @desc    Update category
// @route   PATCH /api/v1/category/update/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    
    if (mongoose.isValidObjectId(categoryId) === false) {
        return next(createError(400, 'Invalid category id'));
    }

  
    if (name) {
        const { error } = categorySchema.validate({ name });
        if (error) {
            error.isJoi = true;
            return next(error);
        }
    }

  
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(createError(404, 'Category not found'));
    }

    if (req.user.id  !== category.userId.toString()) {
        return next(createError(401, 'Unauthorized!'));
    }

    category.name = name || category.name; 
    await category.save(); 

  
    return returnJson(res, 200, true, 'Category updated successfully', {
        name: category.name,
        updatedAt: category.updatedAt
    });
});



// @desc    Delete category
// @route   Delete /api/v1/category/delete/:id
// @access  Private

exports.deleteCategory = asyncHandler( async (req, res, next) => {
    const categoryId = req.params.id

        if (mongoose.isValidObjectId(categoryId) === false) {
            return next(createError(400, 'invalid category id'))
        }

        
        const category = await Category.findById(categoryId)
        if (!category) {
            return next(createError(404, 'category not found!!'))
        }

        if (category.userId.toString() !== req.user.id) {
            return next(createError(401, 'unauthorized!'))
        }

       
        await Category.deleteOne({ _id: categoryId });

        return returnJson(res, 200, 'Category deleted successfully', null);
     
})


// @desc    Get categories
// @route   Get /api/v1/category/get
// @access  Private

exports.getCategories = asyncHandler( async (req, res, next) =>{
    const userId = req.user.id

    const categories = await Category.find({userId, isActive :true}).select('-__v ')
    if(categories.length === 0){
        return next(createError(404, 'No categories found'))
    }
    return returnJson(res, 200, 'Categories fetched successfully', categories)
})




// @desc    DisActive category
// @route   PATCH /api/v1/category/disActive/:id
// @access  Private

exports.disActive = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;

    if (mongoose.isValidObjectId(categoryId) === false) {
        return next(createError(400, 'invalid category id'))
    }


    const category = await Category.findById(categoryId);
    if (!category) {
        return next(createError(404, 'Category not found'));
    }

    await Category.updateOne({ _id: categoryId }, { $set: { isActive: false } });

    return returnJson(res, 200, true, 'Category disabled successfully', null);
});



// @desc    Active category
// @route   PATCH /api/v1/category/Active/:id
// @access  Private

exports.Active = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;

    if(mongoose.isValidObjectId(categoryId) === false){
        return next(createError(400, 'invalid category id'))
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        return next(createError(404, 'Category not found'));
    }

    await Category.updateOne({ _id: categoryId }, { $set: { isActive: true } });

    return returnJson(res, 200, true, 'Category enabled successfully', null);
});


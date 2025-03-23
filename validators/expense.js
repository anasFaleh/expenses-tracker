const joi = require('joi')

const expenseSchema = joi.object({
    amount: joi.number().positive().required(),
    description: joi.string().allow('', null).trim(),
    paymentMethod: joi.string().valid('Cash', 'Card', 'Transfer', 'Other').default('Cash'),
    currency: joi.string().default('USD'),
    category: joi.string().required()
    

})


const expenseUpdateSchema = joi.object({
    amount: joi.number().positive(),
    description: joi.string().allow('', null).trim(),
    paymentMethod: joi.string().valid('Cash', 'Card', 'Transfer', 'Other').default('Cash'),
    currency: joi.string().default('USD'),


})


module.exports = {
    expenseSchema,
    expenseUpdateSchema

};
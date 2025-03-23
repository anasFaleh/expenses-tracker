const Joi = require("joi");
const mongoose = require("mongoose");

const validateIncome = (data) => {
  const schema = Joi.object({
    source: Joi.string()
      .valid("Salary", "Freelance", "Investment", "Business", "Other")
      .required(),

    amount: Joi.number().min(0).required().messages({
      "number.min": "Amount must be a positive number",
    }),

    description: Joi.string().trim().allow("").optional(),

    currency: Joi.string().default("USD"),

    isRecurring: Joi.boolean().default(false),

    recurrenceType: Joi.string()
      .valid("Monthly", "Weekly", "Yearly", "None")
      .default("None"),
  });

  return schema.validate(data);
};



const validateIncomeUpdate = (data) => {
  const schema = Joi.object({
    source: Joi.string().valid("Salary", "Freelance", "Investment", "Business", "Other"),

    amount: Joi.number().min(0).messages({
      "number.min": "Amount must be a positive number",
    }),

    description: Joi.string().trim().allow("").optional(),

    currency: Joi.string(),

    isRecurring: Joi.boolean(),

    recurrenceType: Joi.string().valid("Monthly", "Weekly", "Yearly", "None"),
  });

  return schema.validate(data);
};


module.exports = {
  validateIncome,
  validateIncomeUpdate
};

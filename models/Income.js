const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      source: {
        type: String,
        required: true,
        enum: ["Salary", "Freelance", "Investment", "Business", "Other"],
      },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be a positive number']
      },
      description: {
        type: String,
        trim: true
      },
      currency: {
        type: String,
        default: 'USD' 
      },
      isRecurring: {
        type: Boolean,
        default: false,
      },
      recurrenceType: {
        type: String,
        enum: ["Monthly", "Weekly", "Yearly", "None"],
        default: "None",
      },

    }, {
        timestamps: true 

    });


    const Income = mongoose.model('Income', incomeSchema)
    
    module.exports = Income 

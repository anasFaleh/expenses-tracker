const mongoose = require('mongoose')

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
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
      paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Transfer', 'Other'], 
        default: 'Cash'
      },
      currency: {
        type: String,
        default: 'USD' 
      }
    }, {
        timestamps: true 
    });
    
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
const mongoose = require('mongoose');
//const { Expense } = require('./models')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true 
});



categorySchema.index({ name: 1 });

//categorySchema.pre('deleteOne', { document: true }, async function (next) {
    //const category = this;

    //await Expense.updateMany(
     //   { categoryId: category._id },
     ///   { $set: { categoryName: category.name } }
    //);

   /// next();
//});

module.exports = mongoose.model('Category', categorySchema);

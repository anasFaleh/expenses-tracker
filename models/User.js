const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    profileImage: {
        type: String,
        required: false
    },
       role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    wallet: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

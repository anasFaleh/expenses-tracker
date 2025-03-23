const e = require('express');
const mongoose = require('mongoose');


const BlacklistedTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
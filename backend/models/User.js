const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    org: { type: String, required: true },
    role: { type: String, required: true },    // procurement / receiving / vendor / auditor
    affiliation: { type: String, required: true },
    password: { type: String, required: true }, // hashed password
    
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

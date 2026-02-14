// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     org: { type: String, required: true },
//     role: { type: String, required: true },    // procurement / receiving / vendor / auditor
//     affiliation: { type: String, required: true },
//     password: { type: String, required: true }, // hashed password
    
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Vendor', 'Buyer', 'Auditor', 'Citizen'],
    required: true
  },
  buyerType: {
    type:String,
    enum:['Procurement Officer', 'Delivery Officer']
  },
  companyName: String,
  institute: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

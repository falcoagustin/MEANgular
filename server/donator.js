// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var DonatorSchema   = new mongoose.Schema({
  name: String,
  lastName: String,
  contactNumber: String,
  email: String,
  address: String,
  bloodGroup: String,
  xCoord: Number,
  yCoord: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Donator', DonatorSchema);

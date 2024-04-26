const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    //required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["User"],
    enum: ["User", "Admin"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

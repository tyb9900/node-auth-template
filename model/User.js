const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);

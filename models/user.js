const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: { type: Boolean, default: false }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ userId: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUserPost(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}
function validateUserPut(user) {
  const schema = {
    name: Joi.string().min(5).max(255),
    email: Joi.string().min(5).max(255).email(),
  };

  return Joi.validate(user, schema);
}
function validateUserPassword(user) {
  const schema = {
    oldPassword: Joi.string().min(5).max(255).required(),
    newPassword: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}
exports.User = User;
exports.validateUserPost = validateUserPost;
exports.validateUserPut = validateUserPut;
exports.validateUserPassword = validateUserPassword;




const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const db = 'mongodb+srv://vidlyuser:12345@cluster0-onnex.mongodb.net/test?retryWrites=true&w=majority';

  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`));
}
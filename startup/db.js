const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const db = 'mongodb://vidlyuser:12345@cluster0-shard-00-00-onnex.mongodb.net:27017,cluster0-shard-00-01-onnex.mongodb.net:27017,cluster0-shard-00-02-onnex.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`));
}
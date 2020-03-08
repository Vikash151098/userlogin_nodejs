const { userAuth, adminAuth } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateUserPost, validateUserPut } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', adminAuth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validateUserPost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('Authorization', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/', userAuth, async (req, res) => {
  const { error } = validateUserPut(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = User.findById(req.user.userId);
  if (!user) return res.status(400).send({ statusCode: 400, message: "Falire", data: "userId not found" })

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  await user.save();

  const token = user.generateAuthToken();
  res.header('Authorization', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/changePassword', userAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = User.findById(req.user.userId);
  if (!user) return res.status(400).send({ statusCode: 400, message: "Falire", data: "userId not found" })

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }
  await user.save();
  res.send(_.pick(user, ['_id', 'name', 'email']));
});
module.exports = router; 

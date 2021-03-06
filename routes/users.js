const { userAuth, adminAuth } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateUserPost, validateUserPut, validateUserPassword } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
mongoose.set("debug", true);

router.get('/', adminAuth, async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {}
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: 1,
        email: 1
      }
    }
  ])
  res.send({ statusCode: 200, message: "Success", data: user });
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
  res.header('Authorization', token).send({ statusCode: 200, message: "Success", data: _.pick(user, ['_id', 'name', 'email']) });
});

router.put('/', userAuth, async (req, res) => {
  const { error } = validateUserPut(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.jwtData.userId);
  if (!user) return res.status(400).send({ statusCode: 400, message: "Falire", data: "userId not found" })

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user = await user.save();

  res.send({ statusCode: 200, message: "Success", data: _.pick(user, ['_id', 'name', 'email']) });
});

router.put('/changePassword', userAuth, async (req, res) => {
  const { error } = validateUserPassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.jwtData.userId);
  if (!user) return res.status(400).send({ statusCode: 400, message: "Falire", data: "userId not found" })

  if (user.password == req.body.oldPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
  }
  await user.save();
  res.send({ statusCode: 200, message: "Success", data: _.pick(user, ['_id', 'name', 'email']) });
});
module.exports = router; 

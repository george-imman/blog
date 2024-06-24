const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(404).send({errorMessage: `User with the name ${username} has already been registered`});
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({message:`${username} you have been registered successfully`});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).send({errorMessage:`User with the name ${username} not found`});
  
  user.comparePassword(password, (err, isMatch) => {
    if (err || !isMatch) return res.status(401).send({errorMessage:`Password incorrect`});
    
    const token = jwt.sign({ id: user._id }, process.env.secret, { expiresIn: '24h' });
    res.json({ token });
  });
});

module.exports = router;

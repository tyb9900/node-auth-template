const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

// * IMPORT ENV FILE
require("dotenv/config");

const ValidateUser = require("../validations/validate_user");

// GET: /users
router.get("/", async (req, res) => {
  const user = await User.find({});
  try {
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST: /users/register
router.post("/register", async (req, res) => {
  // * VALIDATE WITH JOI
  const validate = ValidateUser(req.body);
  if (validate.error)
    return res.status(400).send(validate.error.details[0].message);

  // * DECONSTRUCT BODY
  const { email, password } = req.body;

  // * HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // * USER OBJECT
  const user = new User({
    email: email,
    password: hashPassword,
  });

  // * SAVE USER IN DATABASE
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST: /users/login
router.post("/login", async (req, res) => {
  // * VALIDATE WITH JOI
  const validate = ValidateUser(req.body);
  if (validate.error)
    return res.status(400).send(validate.error.details[0].message);

  // * LOGIN USER
  try {
    // * DECONSTRUCT OBJECT
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("Email or Password incorrect");

    // * VALIDATE PASSWORD
    const validPassword = await bcrypt.compare(password, user.password);

    // * WRONG PASSWORD
    if (!validPassword)
      return res.status(400).send("Email or Password incorrect");

    // * RETURN JSON AUTH TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send({ "auth-token": token });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

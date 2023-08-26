const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require("../common");

const User = require("../models/User");
const router = express.Router();

const fs = require("fs").promises;

router.get("/", common.verifyToken, async (req, res) => {
  let users = await User.find();

  res.send(users);
  res.end();
});

router.post("/", async (req, res) => {
  const { username, email, password, fullname } = req.body;

  const existingUsername = await User.findOne({ username: username });
  if (existingUsername) {
    res.status(400).send("Username already taken.");
    return;
  }

  const existingEmail = await User.findOne({ email: email });
  if (existingEmail) {
    res.status(400).send("Email already taken.");
    return;
  }

  bcrypt.hash(req.body.password, 10).then(async (hashedPassword) => {
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      fullname: req.body.fullname,
    });
    try {
      await user.save();
      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
        },
        "483495483jkfgju8jfklgfhghs"
      );
      res.send({ token: token, user, username: user.username});
      res.end();
    } catch (err) {
      res.status(404);
      res.send(err);
      res.end();
    }
  });
});

router.post("/login", async (req, res) => {
  let user = await User.findOne({
    username: req.body.username,
  });
  if (user) {
    bcrypt.compare(req.body.password, user.password).then((result) => {
      if (result) {
        const token = jwt.sign(
          {
            _id: user._id,
            username: user.username,
          },
          "483495483jkfgju8jfklgfhghs"
        );
        res.send({ token: token, username: user.username });
        res.end();
      } else {
        res.status(400);
        res.send("Inccorect Username or Password !");
        res.end();
      }
    });
  } else {
    res.status(404);
    res.send("User Does not Exist !");
    res.end();
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });

  if (user) {
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.fullname = req.body.fullname;
  }

  try {
    await user.save();
    res.send(user);
    res.end();
  } catch (err) {
    res.status(500);
    res.send(err);
    res.end();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.deleteOne({
      _id: req.params.id,
    });
    res.status(200);
    res.send(await User.find());
    res.end();
  } catch (err) {
    res.status(500);
    res.send(err);
    res.end();
  }
});

module.exports = router;

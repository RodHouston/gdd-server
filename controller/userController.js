const express = require("express");
const User = require("../model/User");
const argon2 = require("argon2");
const multer = require("multer");
const { uploadFile } = require("../utils/s3");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// register user
router.post("/register", async (req, res) => {
  try {
    // upload user avatar to s3 and capture img path
    const file = req.file;
    // set up default image
    let img =
      "https://joybee.s3.amazonaws.com/37ca0cc0f10936bd31bd2ec38ae31e25";

    // if image file present, upload to s3 and overwrite the default img
    if (file) {
      console.log(file.mimetype);
      const allowedImgTypes = ["image/jpeg", "image/png"];
      if (allowedImgTypes.includes(file.mimetype)) {
        console.log("file type allowed");
        const result = await uploadFile(file);
        img = result.Location;
      }
    }

    const { username, email, password, company, location, description } =
      req.body;
    // confirm username and email is not taken
    const userAlreadyExists = await User.findOne({
      $or: [
        {
          username: { $regex: new RegExp("^" + username + "$"), $options: "i" },
        },
        { email: { $regex: new RegExp("^" + email + "$"), $options: "i" } },
      ],
    });
    console.log("username: ", username);
    console.log("email: ", email);
    console.log("user: ", userAlreadyExists);
    if (userAlreadyExists) {
      res.json({ error: "Username / email already registered" });
      return;
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      designs: [],
      collabs: [],
      image: img,
      company,
      location,
      description,
      collabRequests: [],
      acceptedRequests: [],
    });
    await newUser.save();
    req.session.user = newUser;
    res.json(newUser);
  } catch (err) {
    res.json(err);
  }
});

// login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // look up user by username
  const user = await User.findOne({ username });
  if (!user) {
    res.json({ error: "No such user found" });
    return;
  }

  console.log("user password in db: ", user.password);
  console.log("user entered password: ", password);
  // check if passwords match
  const passwordsMatch = await argon2.verify(user.password, password);

  // login on success
  if (passwordsMatch) {
    req.session.user = user;
    res.json({ user, session: req.session.user });
    return;
  }

  // redirect to login if fail
  res.json({ error: "Passwords didn't match" });
});

// logout user
router.post("/logout", async (req, res) => {
  await req.session.destroy();
  res.json({ destroyed: true });
});

module.exports = router;

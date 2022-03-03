const express = require("express");
const User = require("../model/User");
const argon2 = require("argon2");

const router = express.Router();


router.post("/register", async (req, res) => {

  try {
    const { username, email, password } = req.body;
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
        console.log("user exist");
      res.json({ error: "Username / email already registered" });
      return;
    }

    const hashedPassword = await argon2.hash(req.body.password);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });



    // await newUser.save();
    await User.create(req.body, (err, newUser) => {
        req.session.user = newUser;
          // res.json(newUser);
          res.redirect('/')
        });



  } catch (err) {
    res.json(err);
  }
});

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

router.post("/logout", async (req, res) => {
  await req.session.destroy();
  res.json({ destroyed: true });
});

module.exports = router;

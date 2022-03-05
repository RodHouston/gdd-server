const express = require("express");
const User = require("../model/User");
const argon2 = require("argon2");
const Design = require("../model/Design");
const multer = require("multer");

const router = express.Router();

const uploadFile = require("../utils/s3");

const upload = multer({ dest: "public/" });

router.post("/register", upload.single("image"), async (req, res) => {
  console.log("inside reg");
  console.log("body img: ", req.body);
  console.log("body username: ", req.body.username);
  //   try {
  // upload user avatar to s3 and capture img path
  const file = req.file;
  console.log("file: ", file);
  console.log("body img: ", req.body);

  // set up default image
  let img = "https://joybee.s3.amazonaws.com/37ca0cc0f10936bd31bd2ec38ae31e25";

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
  const { username, email, password } = req.body;
  console.log(req.body);
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

  console.log("hello there");
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    company: req.body.company,
    description: req.body.description,
    location: req.body.location,
    image: img,
    designs: [],
    collabs: [],
    collabRequests: [],
    acceptedRequests: [],
    collaboratorIds: [],
  });

  const result = await newUser.save();
  console.log(result);
  req.session.user = newUser;
  res.json(newUser);
  //   } catch (err) {
  //     res.json({ error: "internal server error" });
  //   }
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

router.delete("/logout", async (req, res) => {
  await req.session.destroy();
  res.json({ destroyed: true });
});

// get user data from cookie-sessions
// "me" query
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }); // case
    console.log("is this thing on?");
    // get designs user owns and collaborates on
    const collabs = user.collabs; // [ design_id]
    const designs = user.designs;
    const allDesigns = await Design.find({
      _id: { $in: [...collabs, ...designs] },
    });
    const myDesigns = allDesigns.filter(
      (d) => String(d.creator) === String(user._id)
    );
    const collabDesigns = allDesigns.filter(
      (d) => String(d.creator) !== String(user._id)
    );

    // get colloborator ids > user _ids
    const collaborators = await User.find({
      _id: { $in: user.collaborators },
    });

    res.json({
      myPage: req.session.user && req.session.user._id === user._id,
      user,
      myDesigns,
      collabDesigns,
      collaborators,
    });
  } catch (err) {
    res.json({ error: err });
  }
});

// get user data from cookie-sessions
// "me" query
router.get("/", async (req, res) => {
  try {
    // get designs user owns and collaborates on
    const collabs = req.session.user.collabs; // [ design_id]
    const designs = req.session.user.designs;
    const allDesigns = await Design.find({
      _id: { $in: [...collabs, ...designs] },
    });
    const myDesigns = allDesigns.filter(
      (d) => String(d.creator) === String(req.session.user._id)
    );
    const collabDesigns = allDesigns.filter(
      (d) => String(d.creator) !== String(req.session.user._id)
    );

    console.log(req.session.user);
    console.log("collab ids: ", req.session.user.collaboratorIds);
    // get colloborator ids > user _ids
    const collaborators = await User.find({
      _id: { $in: req.session.user.collaboratorIds },
    });
    console.log("collabers", collaborators);

    res.json({
      myPage: true,
      user: req.session.user,
      myDesigns,
      collabDesigns,
      collaborators,
    });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;

const express = require("express");
const Design = require("../model/Design");
const User = require("../model/User");
const router = express.Router();

// create a new design document starting from the name property
router.post("/create", async (req, res) => {
  try {
    const newDoc = new Design({
      name: req.body.name,
      creator: req.session.user._id,
      image: "https://joybee.s3.amazonaws.com/37ca0cc0f10936bd31bd2ec38ae31e25",
      collaborators: [],
      characters: [],
      locations: [],
      items: [],
      gameplay: [],
      genre: "ADVENTURE",
      deleted: false,
    });
    await newDoc.save();

    const newDocId = newDoc._id;
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { designs: newDocId },
    });
    res.json(newDoc);
  } catch (err) {
    res.json({ error: err });
  }
});

// edit document
router.put("/edit/:editid", async (req, res) => {
  try {
    const { editid } = req.params;
    const { update } = req.body;
    console.log("editod: ", editid);
    console.log("update: ", update);
    const updatedDoc = await Design.findByIdAndUpdate(editid, update, {
      new: true,
    });
    res.json(updatedDoc);
  } catch (err) {
    res.json({ error: err });
  }
});

// move document to trash
router.put("/trash/:designid", async (req, res) => {
  try {
    const updatedDoc = await Design.findByIdAndUpdate(req.params.designid, {
      deleted: true,
    });
    res.json(updatedDoc);
  } catch (err) {
    res.json({ error: err });
  }
});

// permadelete document
router.delete("/delete/:designid", async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.designid);
    // remove from collaborators as well
    // remove from user
    res.json({ deleted: true });
  } catch (err) {
    res.json({ error: err });
  }
});

// request to join project

// remove self from project/ rescind request

// add user as collaborator

// remove user as collaborator

// get individual document
router.get("/:designid", async (req, res) => {
  try {
    const doc = await Design.findById(req.params.designid);
    res.json(doc);
  } catch (err) {
    res.json({ error: err });
  }
});

// get user docs
router.get("/user", async (req, res) => {
  try {
    // get the ids for your own designs and collaborations
    if (!req.session.user) {
      res.json({ error: "unauthenticated" });
      return;
    }
    const docs = await Design.find({
      _id: { $in: [...req.session.user.designs, ...req.session.user.collabs] },
    });
    res.json(docs);
  } catch (err) {
    res.json({ error: err });
  }
});

// search for specific documents
router.post("/search", async (req, res) => {
  console.log("hello?");
  console.log(req.body);
  try {
    let searchParams = req.body.searchParams;
    if (searchParams.username) {
      const creators = await User.find({
        username: req.body.searchParams.username,
      });

      const creatorIds = creators.map((c) => c._id);
      searchParams.creator = { $in: creatorIds };
    }

    const docs = await Design.find(searchParams);
    console.log(docs);
    res.json(docs);
  } catch (err) {
    res.json({ error: err });
  }
});

// get all specified documents
router.get("/", async (req, res) => {
  try {
    const docs = await Design.find({ _id: { $in: req.body.designIds } });
    res.json(docs);
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;

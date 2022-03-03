const express = require("express");
const Design = require("../model/Design");
const router = express.Router();

// create a new design document
router.post("/create", async (req, res) => {
  try {
    const newDoc = new Design({
      ...req.body,
      image: "blah",
      creator: req.session.user._id,
      collaborators: [],
      deleted: false,
    });
    await newDoc.save();
    res.json(newDoc);
  } catch (err) {
    res.json({ error: err });
  }
});

// edit document

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

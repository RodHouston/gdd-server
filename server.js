const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const main = async () => {
  // initialize the app
  const app = express();

  // connect mongoose
  await mongoose.connect(process.env.MONGODB_URI);
  if (mongoose.connection.readyState === 1) {
    console.log("Mongoose connected");
  } else {
    console.log("Mongoose Not Connected!");
  }

  // set up middleware
  app.use(express.json());
  app.use(cors());

  // set up routes
  app.get("/", (req, res) => {
    res.json({ hello: "world" });
  });

  // boot up server
  app.listen(process.env.PORT || 8000, () => {
    console.log("listening...");
  });
};

main().catch((err) => console.log(err));

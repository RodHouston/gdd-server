const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const main = async () => {
  // initialize the app
  const app = express();

  // connect mongoose
  await mongoose.connect("mongodb://localhost:27017/gdd");
  mongoose.connection.once("open", () => {
    console.log("Mongoose connected");
  });

  // set up middleware
  app.use(express.json());
  app.use(cors());

  // boot up server
  const PORT = 8000;
  app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
};

main().catch((err) => console.log(err));

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const Redis = require("ioredis");
const connectRedis = require("connect-redis");

const main = async () => {
  // initialize the app
  const app = express();

  app.set("trust proxy", 1);

  // connect mongoose
  await mongoose.connect(process.env.MONGODB_URI);
  if (mongoose.connection.readyState === 1) {
    console.log("Mongoose connected");
  } else {
    console.log("Mongoose Not Connected!");
  }

  // connect Redis
  const RedisStore = connectRedis(session);
  const redisURL = process.env.REDIS_TLS_URL;
  let redis;
  if (redisURL) {
    redis = new Redis(redisURL, {
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else {
    redis = new Redis(); // auto connect if running on localhost
  }

  // test redis
  await redis
    .ping()
    .then((pong) => console.log(pong + "! Redis has been connected"));

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

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const Redis = require("ioredis");
const connectRedis = require("connect-redis");
const userController = require("./controller/userController");
const designController = require("./controller/designController");

const main = async () => {
  // initialize the app
  const app = express();
  console.log(process.env.NODE_ENV);

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
  app.use(
    cors({
      origin: ["https://www.gamedocs.app", "http://localhost:3000"],
      credentials: true,
    })
  );

  // set up sessions
  app.use(
    session({
      name: "cid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        proxy: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production", // disable for dev in localhost
        //domain: __PROD__ ? ".herokuapp.com" : undefined, // add domain when in prod
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  // set up routes
  app.get("/", (req, res) => {
    console.log(req.session);
    res.json({ hello: "world" });
  });

  app.get("/protected", (req, res) => {
    console.log(req.session);
    console.log("USER: ", req.session.user);
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.send("nope!");
    }
  });

  app.get("/login", (req, res) => {
    console.log(req.session);
    req.session.user = "me";
    console.log(req.session);
    res.redirect("/");
  });

  app.get("/logout", async (req, res) => {
    console.log(req.session);
    await req.session.destroy();
    res.send("destroyed");
  });

  app.use("/user", userController);
  app.use("/doc", designController);

  // boot up server
  app.listen(process.env.PORT || 8000, () => {
    console.log("listening...");
  });
};

main().catch((err) => console.log(err));

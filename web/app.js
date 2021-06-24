require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");

const { Database } = require("./database.js");

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");

const app = express();

app.use(session({
  secret: process.env.SECRET_KEY,
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    clientPromise: Database,
    dbName: "sync"
  })
}));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.session.csrf === undefined)
    req.session.csrf = crypto.randomBytes(32).toString("hex");

  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.listen(80, () => {
  console.log("Started listening on :80");
});
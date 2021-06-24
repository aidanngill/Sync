const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const discord = require("../discord.js");

router.get("/login", (req, res) => {
  const sess = req.session;

  if (sess.authenticated)
    return res.redirect("/user/home");

  sess.state = crypto.randomBytes(32).toString("hex");

  const discordLogin = discord.generateAuthUrl({
    scope: ["identify", "guilds"],
    state: sess.state
  });

  return res.redirect(discordLogin);
});

router.get("/callback", (req, res) => {
  const sess = req.session;

  if (!sess.state || !req.query.state || req.query.state !== sess.state)
    return res.status(400).send("Invalid state.");

  discord.tokenRequest({
    code: req.query.code,
    scope: "identify guilds",
    grantType: "authorization_code",
    redirectUri: process.env.DISCORD_CALLBACK
  })
  .then((data) => {
    sess.accessToken = data.access_token;
    sess.authenticated = true;

    res.redirect("/user/home");
  });
});

module.exports = router;
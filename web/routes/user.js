const express = require("express");
const router = express.Router();

const discord = require("../discord.js");
const { Student } = require("../database.js");

router.use((req, res, next) => {
  if (!req.session.authenticated)
    return res.redirect("/auth/login");

  next();
});

router.use(async (req, res, next) => {
  const user = await discord.getUser(req.session.accessToken).catch(() => {
    req.session.destroy();
  });

  if (!user)
    return res.redirect("/auth/login");

  req.user = user;
  next();
});

router.use(async (req, res, next) => {
  let student = await Student.findOne({
    discord: req.user.id
  }).lean();

  req.student = student ? student : {};
  next();
});

const capitalizeString = (str) => {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

router.get("/home", (req, res) => {
  if (!req.student)
    return res.redirect("/user/settings");

  return res.render("home", { user: req.user });
});

router.get("/settings", (req, res) => {
  return res.render("settings", {
    token: req.session.csrf,
    errors: {},
    student: req.student
  });
});

router.post("/settings", async (req, res) => {
  if (req.session.csrf !== req.body.csrf)
    return res.status(403).send("Invalid CSRF token.");

  let errors = {};
  let formData = {
    name: req.body.name,
    student: req.body.student,
    discord: req.user.id,
    phone: req.body.phone,
    email: req.body.email
  }

  if (Object.keys(req.student).length > 0) {
    await Student.updateOne({
      _id: req.student._id
    }, {
      $set: formData
    }, {
      runValidators: true
    }).catch(error => {
      if (error.name === "CastError") {
        errors = {
          [error.path]: `${capitalizeString(error.path)} must be a ${error.kind.toLowerCase()}.`
        }
      } else {
        errors = error.errors;
      }
    });
  } else {
    const student = new Student(formData);
    let error = student.validateSync();

    if (!error) {
      student.save();
    } else {
      errors = error.errors;
    }
  }

  return res.render("settings", {
    token: req.session.csrf,
    errors: errors,
    student: formData
  });
});

module.exports = router;
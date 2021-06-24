const mongoose = require("mongoose");
const { isAlpha, isAlphanumeric, isEmail, isMobilePhone } = require("validator");

const dbClient = mongoose.connect("mongodb://localhost:27017/sync", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(m => m.connection.getClient());

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 64,
    validate: {
      validator: (val) => isAlpha(val, "en-US", {ignore: " -'"}),
      message: "Full name may only contain standard letters."
    }
  },
  student: {
    type: String,
    required: true,
    uppercase: true,
    max: 16,
    validate: isAlphanumeric
  },
  discord: Number,
  phone: {
    type: String,
    unique: true,
    validate: {
      validator: (val) => isMobilePhone(val.replace(/ /g, "")),
      message: "Phone number must be valid."
    }
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: {
      validator: (val) => val ? isEmail(val) : true,
      message: "Email must be valid."
    }
  }
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = {
  Database: dbClient,
  Student: Student
};
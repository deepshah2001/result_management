// Imported or required all necessary npm packages (jwt used for token verification and genration, bcrypt for encrytion of password (one-way))
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Teacher = require("../models/teacher.js");

const expensePage = path.join(
    __dirname,
    "..",
    "views",
  );

// For handling all signup scenarios for a user
exports.addTeacher = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const emailExists = await Teacher.findOne({ email: email });

  if (emailExists) {
    res.status(403).json({ error: "Email already Exists!" });
  } else {
    try {
      const saltRounds = 10;
      // Encrypting the password to store it in database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        console.log(err);
        const teacher = new Teacher({
          name: userName,
          email: email,
          password: hash,
        });
        teacher.save();
        res.status(201).json({ message: "Successfully New Teacher Created!" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server Error! Please try again!" });
    }
  }
};

// Generating Token using jwt (jsonwebtoken)
function generateWebToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.TOKEN_ID);
}

// For handling all login scenarios for a user
exports.existingTeacher = async (req, res, next) => {
  const { email, password } = req.body;

  const emailExists = await Teacher.findOne({ email: email });
//   console.log(emailExists);

  if (emailExists) {
    bcrypt.compare(password, emailExists.password, (err, response) => {
      if (err) {
        res.status(500).json({ message: "Something went Wrong!" });
      }
      if (response) {
        // Only called the function for generating token when the user is successfully signed in or logged in otherwise no use
        res.status(201).json({
          path: expensePage,
          message: "Logged in successfully!",
          token: generateWebToken(emailExists.id, emailExists.name),
        });
      } else {
        res.status(401).json({ error: "Password Incorrect!" });
      }
    });
  } else {
    res.status(404).json({ error: "User Not Found!" });
  }
};

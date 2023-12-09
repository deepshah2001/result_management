const jwt = require("jsonwebtoken");

const Result = require("../models/result");

// Generating Token using jwt (jsonwebtoken)
function generateWebToken(roll, dob) {
  return jwt.sign({ rollNumber: roll, dateOfBirth: dob }, process.env.TOKEN_ID);
}

exports.existingStudent = async (req, res, next) => {
  const { roll, dob } = req.body;

  if (!roll || !dob) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const resultExists = await Result.findOne({
    rollNumber: roll,
    dateOfBirth: dob,
  });

  if (resultExists) {
    res.status(201).json({
      token: generateWebToken(roll, dob),
    });
  } else {
    // Result doesn't exist, send a 404 status or a custom message
    res
      .status(404)
      .json({ message: "User doesn't exist. Please sign up to continue." });
  }
};

exports.getResult = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });
    }

    const student = jwt.verify(token, process.env.TOKEN_ID);
    // console.log(student);
    const result = await Result.findOne({
      rollNumber: student.rollNumber,
      dateOfBirth: student.dateOfBirth,
    });

    if(result) {
        res.status(201).json({result});
    } else {
        res.status(404).json({result: "No Result Found"});
    }
  } catch (err) {
    console.log(err);
  }
};

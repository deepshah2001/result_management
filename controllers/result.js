const mongoose = require("mongoose");

const Result = require("../models/result");
const Teacher = require("../models/teacher");

exports.getResult = async (req, res, next) => {
  try {
    // Finding all the results of the user with the user id which has been logged in using the token verification
    const results = await Result.find({ userId: req.user._id });

    const totalResultCount = results.length;

    res.status(200).json({
      results: results,
      totalCount: totalResultCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

exports.addResult = async (req, res, next) => {
  try {
    const { rollNumber, name, dob, score } = req.body;
    let dateOfBirth = dob.split("T")[0];
    // dateOfBirth = dateOfBirth.toLocaleDateString('en-CA');
    // console.log(dateOfBirth);
    // Adding result of a user with their unique user id in expense table
    const existingResult = await Result.findOne({ rollNumber: rollNumber });

    if (existingResult) {
      res.json({ error: "Roll number already present" });
    } else {
      const result = new Result({
        userId: req.user._id,
        rollNumber: rollNumber,
        name: name,
        dateOfBirth: dateOfBirth,
        Score: score,
      });
      result.save();

      res.status(201).json({ result: result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.deleteResult = async (req, res, next) => {
  const resultId = req.params.resultId;
  try {
    // Find the result by ID and delete it
    const result = await Result.findByIdAndDelete(resultId);

    // Check if the result exists
    if (!result) {
      return res.status(404).json({ success: false, error: 'Result not found' });
    }

    // Respond with a success message or additional data if needed
    res.status(200).json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getEditResult = async (req, res, next) => {
  const resultId = req.params.resultId;
  try {
    const result = await Result.findById(resultId);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, error: "Result not Found!" });
    }

    res.status(201).json({ success: true, result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.editResult = async (req, res, next) => {
  let resultId = req.params.resultId;

  try {
    // Find the result by ID
    const result = await Result.findById(resultId);

    // Check if the result exists
    if (!result) {
      return res.status(404).json({ success: false, error: 'Result not found' });
    }

    // Update the result fields with the new data from the request body
    result.rollNumber = req.body.rollNumber || result.rollNumber;
    result.name = req.body.name || result.name;
    result.dateOfBirth = req.body.dob || result.dateOfBirth;
    result.Score = req.body.score || result.Score;

    // Save the updated result
    await result.save();

    // Respond with the updated result
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

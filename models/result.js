const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Created model for structure of table in database
const resultSchema = new Schema({
  rollNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  Score: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
});

module.exports = mongoose.model("Result", resultSchema);

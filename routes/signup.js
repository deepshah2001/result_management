const express = require("express");

const teachers = require("../controllers/signup");

const router = express.Router();

// For signup
router.post("/add-teacher", teachers.addTeacher);

// For login
router.post("/verify-teacher", teachers.existingTeacher);

module.exports = router;

const express = require("express");

const student = require("../controllers/student");

const router = express.Router();

// For login
router.post("/verify-student", student.existingStudent);

router.get("/get-result", student.getResult);

module.exports = router;
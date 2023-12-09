const express = require("express");

// Used middleware for verification of user with their id and storing it in expense table in database.
const userAuthentication = require("../middlewares/auth");
const results = require("../controllers/result");

const router = express.Router();

// /expenses => userAuthentication (middleware) => (next()) -> expenses (middleware)   [Flow of request]
router.get("/show-results", userAuthentication.getVerified, results.getResult);

router.post("/add-result", userAuthentication.getVerified, results.addResult);

router.delete(
  "/delete-result/:resultId",
  userAuthentication.getVerified,
  results.deleteResult
);

router.get(
  "/edit-result/:resultId",
  userAuthentication.getVerified,
  results.getEditResult
);

router.patch(
  "/edit-result/:resultId",
  userAuthentication.getVerified,
  results.editResult
);

module.exports = router;

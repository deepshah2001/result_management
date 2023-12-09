const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require('./config');

const signupRoutes = require('./routes/signup');
const resultRoutes = require('./routes/result');
const studentRoutes = require('./routes/student');

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use("/teacher", signupRoutes);
app.use("/results", resultRoutes);
app.use("/student", studentRoutes);

app.get("/", (req, res, next) => {
  res.send("Hello, world!");
});

mongoose.connect(config.mongoURI)
    // .sync({force: true})
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server Started at http://localhost:3000")
        })
    })
    .catch(err => console.log(err));

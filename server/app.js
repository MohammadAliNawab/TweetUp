const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
require("dotenv").config();

const app = express();

require("./utilities/passport")(passport);
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/user", require("./routes/users"));

app.listen(process.env.PORT || 4000, () =>
  console.log("Server started listening on port 4000")
);

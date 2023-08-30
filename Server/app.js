const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const sequelize = require("./src/db/db");
const { DataTypes } = require("sequelize");
const User = require("./src/models/user")(sequelize, DataTypes);
const passport = require("passport");
require("./config/passport");
const jwt = require("jsonwebtoken");
const session = require("express-session");

//Initializing express
const app = express();

//Initializing
//Express Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
  session({
    secret: "ABADADADDABADVADVDAeq42g2222",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Login Route
// Login route
// Login route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user object and token
    res.json({ user: user, token: token });
  })(req, res, next);
});

//Logout Route
app.get("/logout", (req, res) => {
  req.logout();
  res.send({ message: "Logged out" });
});
// Registration route
app.post("/register", async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Create a new user
    const newUser = await User.create({
      email: email,
      password: password,
      name: name,
      age: age,
      gender: gender,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user object and token
    res.json({ user: newUser, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed." });
  }
});

// const isAuthenticated = (req, res, next) => {
//   if (req.user) return next();
//   else
//     return res.status(401).json({
//       error: "User not authenticated",
//     });
// };

// app.use(isAuthenticated);
//Route
app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
  try {
    await sequelize
      .sync
      //{force: true}
      ();
    console.log("Connected to database");
  } catch (error) {
    console.error(`Error: Cannot connect to database ${error}`);
  }
});

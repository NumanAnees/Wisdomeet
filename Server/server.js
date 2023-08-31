//Module imports
require("dotenv").config();
require("./src/config/passport");

//Libraries imports
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const sequelize = require("./src/db/db");
const passport = require("passport");
const fileUpload = require("express-fileupload");

//Initializing express
const app = express();

//Express Middlewares
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(fileUpload({ useTempFiles: true }));

//App routes
const AppRoutes = require("./src/app/routes");
app.use("/api", AppRoutes);

//Testing route
app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
  try {
    await sequelize.sync();
    console.log("Connected to database");
  } catch (error) {
    console.error(`Error: Cannot connect to database ${error}`);
  }
});

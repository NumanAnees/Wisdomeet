const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const sequelize = require("./src/db/db");
const passport = require("passport");
require("./src/config/passport");
const fileUpload = require("express-fileupload");

//Initializing express
const app = express();

//Express Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(fileUpload({ useTempFiles: true }));

//routes
const authRoutes = require("./src/app/routes/user");
//middlewares
app.use("/api", authRoutes);

//Testing route
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

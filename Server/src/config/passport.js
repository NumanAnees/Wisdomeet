const sequelize = require("../db/db");
const { DataTypes } = require("sequelize");
const User = require("../../models/user")(sequelize, DataTypes);
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ where: { email: email } })
      .then(async (user) => {
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

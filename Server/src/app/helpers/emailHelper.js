const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
const emailHelper = async (savedUser) => {
  try {
    const emailToken = jwt.sign(
      {
        id: savedUser.id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const url = `${
      process.env.ENVIRONMENT === "development"
        ? "http://localhost:8000"
        : "http://localhost:8000"
    }/api/user/confirmation/${emailToken}`;

    await transporter.sendMail({
      to: savedUser.email,
      subject: "Confirm Your Email Address",
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  emailHelper,
};

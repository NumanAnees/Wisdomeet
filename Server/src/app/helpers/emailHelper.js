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
      process.env.ENVIRONMENT === "Development"
        ? "http://localhost:3000"
        : "http://localhost:3000"
    }/api/user/confirmation/${emailToken}`;
    const uri = "http://localhost:3000";

    const htmlContent = `
      <html>
        <head>
          <style>
            /* Add your inline CSS styles here */
            .container {
              text-align: center;
              background-color: #f5f5f5;
              padding: 20px;
            }
            .welcome-text {
              font-size: 24px;
              color: #333;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: white;
              color: white;
              font-size: 14px;
              font-weight: 600;
              text-decoration: none;
              border-radius: 5px;
              border:2px solid black;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="welcome-text">Welcome to Quora!</p>
            <p>Thank you for joining our app. We're excited to have you on board.</p>
            <a href="${uri}" class="button">Start using the app</a>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      to: savedUser.email,
      subject: "Welcome to Quora",
      html: htmlContent,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  emailHelper,
};

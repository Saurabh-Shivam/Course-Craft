const nodemailer = require("nodemailer");
require("dotenv").config();
// from nodemailer documentation
// this is the setup for the pre middleware used in the OTP model
// we have made this mailSender function so that we can send otp in mail to the user
const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "Course Craft || Project - by Saurabh",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;

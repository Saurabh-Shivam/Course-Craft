const nodemailer = require("nodemailer");

// from nodemailer documentation
// this is the setup for the pre middleware used in the OTP model
// we have made this mailSender function so that we can send otp in mail to the user
const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      // we send mail with the help of transporter and here MAIL_USER , MAIL_PASS contain app password of that email which send email
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "CourseCraft - by Saurabh Shivam",
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

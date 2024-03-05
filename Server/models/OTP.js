const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// function to send email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from Course Craft",
      otp
    );
    console.log("Email sent Successfully: ", mailResponse);
  } catch (error) {
    // we include these string lines in the console of catch block to make the tester get exact information where the error is happening
    // do include these while building a production build application/website
    console.log("Error occured while sending the mails: ", error);
    throw error;
  }
}

// using pre middleware which lets us send verification mail with the given data before saving the document to database
// this.email and this.otp -> current object data
OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);

const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

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
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

//function -> to send emails of otp by using nodejs module "nodemailer" which was created in "/utils/mailSender"
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from CourseCraft",
      emailTemplate(otp)
    );
    console.log("Email sent Successfully: ", mailResponse);
  } catch (error) {
    // we include these string lines in the console of catch block to make the tester get exact information where the error is happening
    // do include these while building a production build application/website
    console.log("error occured while sending mails: ", error);
    throw error;
  }
}

// using pre middleware which lets us send verification mail with the given data before saving the document to database
// this.email and this.otp -> current object data
OTPSchema.pre("save", async function (next) {
  //here pre-save means otp is sended before the saving of OTPSchema.
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);

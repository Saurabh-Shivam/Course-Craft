const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    // get mail from req body
    const { email } = req.body;

    // check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findByIdAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true } // when we give new: true the updated document will return in the response
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail cotaining the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    // return response
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully, please check email and change password",
    });
  } catch (error) {
    console.log("Error while reseting password: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending resetting password link in mail",
    });
  }
};

//resetPassword
exports.resetPassword = async (Req, res) => {
  try {
    // fetch the data
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password do not match",
      });
    }

    // get user details from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }

    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expired, please regenerate your token",
      });
    }

    // hash password and confirm password
    const hashedPassword = await bcrypt.hash(password, 10);
    //   const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

    // password and confirm password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    //   await User.findOneAndUpdate(
    //     { token: token },
    //     { password: hashedConfirmPassword },
    //     { new: true }
    //   );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error while reseting password: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};

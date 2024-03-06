const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SendOTP
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request body
    const { email } = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });

    // if user already exists, then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // This is a brute force approach as we are continously checking and generating otp and making DB calls
    // This is a very very bad approach, generally we tie up with some services to send otp for production build applications
    // generate otp with the help of generate otp package
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    // check the otp generated is unique or not
    let result = await OTP.findOne({ otp: otp });

    // if the otp is not unique we will generate new otp till it's unique
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    // creating otp object
    const otpPayload = { email, otp };
    // creating an entry for OTP in DB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return successful response
    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
      otp,
    });
  } catch (error) {
    console.log("Error while sending otp: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SignUp
exports.signUp = async (req, res) => {
  try {
    // data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validating the values
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // matching the two passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password Value does not match, please try again",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent OTP stored for the user
    // NOTE :-> { createdAt: -1 } argument specifies that the results should be sorted by the createdAt field in descending order (-1). This means the most recently created document (the latest OTP entry for the specified email) will be the first in the result set.
    // .limit(1): This method limits the number of documents returned by the query to 1. Since the results are already sorted in descending order by the createdAt field, this effectively means the query will return the most recent OTP document for the specified email.
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    // validate OTP
    if (recentOtp.length == 0) {
      // OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create entry in DB
    // created a Profile Schema entry in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}` -> generates an profile image corresponding with the name
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log("User SignUp Error: ", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, Please try again",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // check whether user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }
    //generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;
      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log("Error while login: ", error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

// Change Password
// TODO: Do this by own
exports.changePassword = async (req, res) => {
  try {
    // getting user data from req.user
    const userDetails = await User.findById(req.user.id);

    // getting oldPassword, newPassword, confirmNewPassword from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    // if old password does not match
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    // Update password
    // create new hash
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    // update in newPassword in DB
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error while changing password: ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to change the password, please try again",
    });
  }
};

const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Controller for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    // get user id
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the profile by id
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // Update the profile fields
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    // Save the updated profile
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// controller for deteling profile
// TODO: How can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validate
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete Assosiated Profile with the User , note we used here "new mongoose.Types.ObjectId()" to convert string into object;
    await Profile.findByIdAndDelete({
      //   _id: new mongoose.Types.ObjectId(user.additionalDetails),
      _id: userDetails.additionalDetails,
    });

    // TODO: Delete user from all enroller courses
    // for (const courseId of user.courses) {
    //   await Course.findByIdAndUpdate(
    //     courseId,
    //     { $pull: { studentsEnrolled: id } },
    //     { new: true }
    //   );
    // }

    // Now Delete User
    await User.findByIdAndDelete({ _id: id });

    // return response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

    // await CourseProgress.deleteMany({ userId: id });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

// handler for displaying all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get courseId and userId
  const { course_id } = req.body;
  const userId = req.user.id;

  // Validation
  // validation courseId
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course ID",
    });
  }
  // valid courseDetail
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }

    // user already pay for the same course
    // converting the user present in string type to object type
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already Enrolled",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // create order
  const amount = course.price;
  const currency = "INR";

  const options = {
    // mandatory data
    amount: amount * 100,
    currency,
    // optional data
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    // return response
    res.json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, mesage: "Could not Initiate Order" });
  }
};

// verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
  // my signature
  const webhookSecret = "12345678";
  // signature send by razorpay
  const signature = req.headers["x-razorpay-signature"];
};

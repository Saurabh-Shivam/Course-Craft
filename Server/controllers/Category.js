const Category = require("../models/Category");

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max)
// }

// creating a Category handler function
exports.createCategory = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all categories handler function
exports.showAllCategories = async (req, res) => {
  try {
    // it finds all Category from DB;
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for getting categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categoryId
    const { categoryId } = req.body;

    // Get courses for the specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        // match: { status: "Published" },
        // populate: "ratingAndReviews",
      })
      .exec();

    // Validation to handle the case when the category is not found
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // // Handle the case when there are no courses
    // if (selectedCategory.courses.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No courses found for the selected category.",
    //   });
    // }

    // Get courses for other/different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    // const categoriesExceptSelected = await Category.find({
    //   _id: { $ne: categoryId },
    // });

    // let differentCategory = await Category.findOne(
    //   categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
    //     ._id
    // )
    //   .populate({
    //     path: "courses",
    //     match: { status: "Published" },
    //   })
    //   .exec();

    // TODO: Get top-selling courses across all categories
    // const allCategories = await Category.find()
    //   .populate({
    //     path: "courses",
    //     match: { status: "Published" },
    //     populate: {
    //       path: "instructor",
    //     },
    //   })
    //   .exec();

    // const allCourses = allCategories.flatMap((category) => category.courses);
    // const mostSellingCourses = allCourses
    //   .sort((a, b) => b.sold - a.sold)
    //   .slice(0, 10);

    // return response
    res.status(200).json({
      success: true,
      // data: { selectedCategory, differentCategory, mostSellingCourses },
      data: { selectedCategory, differentCategories },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  updateFollowers,
  updateFollowing,
  imageUploadController,
  getUserDetails,
  getUserTweets,
} = require("../controllers/userController");
const isAuthenticatedUser = require("../middleware/auth");
const router = express.Router();
const path = require("path");

const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePictures"); // Specify the directory where uploaded profile pictures will be stored
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname); // Get the file extension
    cb(null, Date.now() + extname); // Generate unique filename with original extension
  },
});

// Multer file filter configuration
const fileFilter = function (req, file, cb) {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Specify allowed file extensions
  const extname = path.extname(file.originalname).toLowerCase(); // Get the file extension in lowercase
  if (allowedExtensions.includes(extname)) {
    cb(null, true); // Allow file upload if the extension is allowed
  } else {
    cb(new Error("Only JPEG, JPG, PNG, and GIF files are allowed")); // Reject file upload if the extension is not allowed
  }
};

// Multer upload configuration with storage and fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/:id").get(isAuthenticatedUser, getUserDetails);
router.route("/user/:id/tweet").get(isAuthenticatedUser, getUserTweets);
// Route to handle image uploads
router.route("/upload-image").post(upload.single("profilePicture"),isAuthenticatedUser,imageUploadController);
// PUT route for updating user profile with multer middleware
router.route("/user/:id/").put(isAuthenticatedUser, updateUserProfile);
// POST route to update user followers
router.route("/user/:id/follow").post(isAuthenticatedUser, updateFollowers);

// POST route to update user following
router.route("/user/:id/unfollow").post(isAuthenticatedUser, updateFollowing);

module.exports = router;

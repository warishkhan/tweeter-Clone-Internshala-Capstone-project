const express = require("express");
const isAuthenticatedUser = require("../middleware/auth");
const router = express.Router();
const path = require("path");

const multer = require("multer");
const {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  replyToTweet,
  retweet,
} = require("../controllers/tweetController");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/image"); // Specify the directory where uploaded profile pictures will be stored
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname); // Get the file extension
    cb(null, Date.now() + extname); // Generate unique filename with original extension
  },
});

// Multer file filter configuration
const fileFilter = function (req, file, cb) {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]; // Specify allowed file extensions
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

router
  .route("/tweet")
  .post(upload.single("image"), isAuthenticatedUser, createTweet);
router.route("/tweet").get(isAuthenticatedUser, getAllTweets);
router.route("/tweet/:id").get(isAuthenticatedUser, getTweetById);
router.route("/tweet/:id").delete(isAuthenticatedUser, deleteTweet);
router.route("/tweet/:id/like").post(isAuthenticatedUser, likeTweet);
router.route("/tweet/:id/unlike").post(isAuthenticatedUser, unlikeTweet);
router.route("/tweet/:tweetId/reply").post(isAuthenticatedUser, replyToTweet);
router.route("/tweet/:tweetId/retweet").post(isAuthenticatedUser, retweet);

module.exports = router;

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const fs = require("fs"); // Import fs module to handle file deletion
const path = require("path");
const Tweet = require("../models/tweetModel");

// Register a User
const registerUser = catchAsyncErrors(async (req, res) => {
  const { name, username, email, password } = req.body;

  // Create new user instance
  const newUser = new User({
    name,
    username,
    email,
    password,
    // profilePicture, // Add profile picture to user object
  });

  // Save user to database
  await newUser.save();
  sendToken(newUser, 201, res);
});

// Login User
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  // checking if user has given password and email both

  if (!username || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Upload profile picture and delete previous image
const imageUploadController = async (req, res) => {
  try {
    // Check if there is a file to upload
    let profilePicture = "";
    if (req.file) {
      profilePicture = req.file.path.replace(/\\/g, "/");
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Delete previous image if exists
    if (user.profilePicture && req.file) {
      const previousImagePath = path.join(
        __dirname,
        `../${user.profilePicture}`
      );
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath); // Delete previous image
      }
    }

    // Save the new profile picture path to the user object
    if (req.file) {
      user.profilePicture = req.file.path.replace(/\\/g, "/");
    }

    // Save the updated user object
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get User Detail
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  sendToken(user,200,res)
});

// Controller function to get user tweets
const getUserTweets = async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch tweets by the user
    const tweets = await Tweet.find({ tweetedBy: user._id }).populate(
      "tweetedBy"
    );

    return res.status(200).json({ success: true, tweets });
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { name, location, dateOfBirth } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile data
    user.name = name || user.name;
    user.location = location || user.location;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;

    // Save the updated user profile
    await user.save();

    res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

// Controller function for updating user followers
const updateFollowers = async (req, res) => {
  const { userId, followUserId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followUser = await User.findById(followUserId);
    if (!followUser) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    if (user.following.includes(followUserId)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    // Add the followUserId to the following array of the current user
    user.following.push(followUserId);

    // Increase the following count of the current user
    user.followingCount += 1;

    await user.save();

    // Add the userId to the followers array of the user being followed
    followUser.followers.push(userId);

    // Increase the followers count of the user being followed
    followUser.followersCount += 1;

    await followUser.save();

    res.json({ message: "Successfully followed user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for updating user following
const updateFollowing = async (req, res) => {
  const { userId, unfollowUserId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const unfollowUser = await User.findById(unfollowUserId);
    if (!unfollowUser) {
      return res.status(404).json({ error: "User to unfollow not found" });
    }

    // Remove the unfollowUserId from the following array of the current user
    user.following.pull(unfollowUserId);

    // Decrease the following count of the current user
    user.followingCount -= 1;

    await user.save();

    // Remove the userId from the followers array of the user being unfollowed
    unfollowUser.followers.pull(userId);

    // Decrease the followers count of the user being unfollowed
    unfollowUser.followersCount -= 1;

    await unfollowUser.save();

    res.json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  imageUploadController,
  getUserDetails,
  updateUserProfile,
  updateFollowers,
  updateFollowing,
  getUserTweets,
};

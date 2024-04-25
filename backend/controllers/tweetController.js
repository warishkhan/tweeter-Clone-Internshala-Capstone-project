const Tweet = require("../models/tweetModel");
const fs = require("fs"); // Import fs module to handle file deletion
const path = require("path");

const createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id; // Assuming the authenticated user's ID is available in req.user

    // Check if profile picture is uploaded
    let image = "";
    if (req.file) {
      // Get file path and replace backslashes with forward slashes
      image = req.file.path.replace(/\\/g, "/");
    }
    const newTweet = await Tweet.create({ content, tweetedBy: userId, image });

    res.status(201).json({ success: true, data: newTweet });
  } catch (error) {
    console.error("Error creating tweet:", error);
    res.status(500).json({ success: false, message: "Error creating tweet" });
  }
};

// getAllTweets/tweetController.js
const getAllTweets = async (req, res) => {
  try {
    // Fetch all tweets, populate referenced fields, and sort by createdAt in descending order
    const tweets = await Tweet.find({})
      .populate("tweetedBy", "-password") // Exclude password field
      .populate("likes", "-password")
      .populate("retweetBy", "-password")
      .populate("replies")
      .sort({ createdAt: -1 });

    // Send the complete details in the response
    res.json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// getTweetById/tweetController.js
const getTweetById = async (req, res) => {
  try {
    const tweetId = req.params.id;

    // Fetch the tweet by ID, populate referenced fields, and exclude user passwords
    const tweet = await Tweet.findById(tweetId)
    // If the tweet is not found, return a 404 Not Found response
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Send the complete tweet details in the response
    res.json(tweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// deleteTweet/tweetController.js
const deleteTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;

    // Retrieve tweet details including the image filename
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Delete previous image if exists
    if (tweet.image) {
      const previousImagePath = path.join(__dirname, `../${tweet.image}`);
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath); // Delete previous image
      }
    }

    // Delete tweet from the database
    await Tweet.findByIdAndDelete(tweetId);

    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    console.error("Error deleting tweet:", error);
    res.status(500).json({ error: "Error deleting tweet" });
  }
};

// like tweet controller
const likeTweet = async (req, res) => {
  try {
    // Find the tweet by ID
    const tweet = await Tweet.findById(req.params.id);

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .json({ success: false, message: "Tweet not found" });
    }

    // Check if the user has already liked the tweet
    if (tweet.likes.includes(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: "You have already liked this tweet" });
    }

    // Add the user's ID to the list of likes
    tweet.likes.push(req.user.id);

    // Save the updated tweet
    await tweet.save();

    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Tweet liked successfully", tweet });
  } catch (error) {
    console.error("Error liking tweet:", error);
    res.status(500).json({ success: false, message: "Failed to like tweet" });
  }
};

// unlikeTweet/tweetController.js
const unlikeTweet = async (req, res) => {
  try {
    // Find the tweet by ID
    const tweet = await Tweet.findById(req.params.id);

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .json({ success: false, message: "Tweet not found" });
    }

    // Check if the user has already liked the tweet
    if (!tweet.likes.includes(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: "You have not liked this tweet" });
    }

    // Remove the user's ID from the list of likes
    tweet.likes = tweet.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );

    // Save the updated tweet
    await tweet.save();

    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Tweet unliked successfully", tweet });
  } catch (error) {
    console.error("Error unliking tweet:", error);
    res.status(500).json({ success: false, message: "Failed to unlike tweet" });
  }
};

// Function to create a reply tweet
const replyToTweet = async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assuming you have middleware to extract the user ID from the request

    // Find the tweet by ID
    const tweet = await Tweet.findOne({ _id: tweetId });

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .json({ success: false, message: "Tweet not found" });
    }

    // Create the reply
    const reply = new Tweet({
      content,
      repliedBy: userId, // Assuming you want to track who replied
    });

    // Push the reply to the 'replies' array of the tweet
    tweet.replies.push(reply);

    // Save the updated tweet
    await tweet.save();

    // Populate the fields in the updated tweet
    const populatedTweet = await Tweet.findById(tweetId)
      .populate("tweetedBy", "username") // Populate 'tweetedBy' with 'username'
      .populate("likes", "username") // Populate 'likes' with 'username'
      .populate("retweetBy", "username") // Populate 'retweetBy' with 'username'
      .populate({
        path: "replies",
        populate: {
          path: "repliedBy",
          select: "username", // Populate 'replies' -> 'repliedBy' with 'username'
        },
      });

    // res.status(201).json({ success: true, message: 'Reply added successfully', reply });
    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      tweet: populatedTweet,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ success: false, message: "Failed to add reply" });
  }
};

const retweet = async (req, res) => {
  try {
    // Extracting the tweet ID from the request parameters
    const tweetId = req.params.tweetId;

    // Check if tweetId is undefined or null
    if (!tweetId) {
      return res
        .status(400)
        .json({ error: "Tweet ID is missing in the request" });
    }

    // Check if the user has already retweeted this tweet
    const userRetweeted = await Tweet.findOne({
      _id: tweetId,
      retweetBy: req.user.id,
    });

    if (userRetweeted) {
      return res
        .status(400)
        .json({ error: "You've already retweeted this tweet" });
    }

    // Update the tweet document by adding the user's ID to the 'retweetBy' array
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { $push: { retweetBy: req.user.id } },
      { new: true }
    )
      .populate("tweetedBy", "name username")
      .populate("retweetBy", "name username");

    if (!updatedTweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Respond with the updated tweet
    res.json(updatedTweet);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retweeting the tweet" });
  }
};

module.exports = {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  replyToTweet,
  retweet,
};

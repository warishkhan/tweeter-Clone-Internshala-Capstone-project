const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  tweetedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  retweetBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  image: {
    type: String
  },
  replies: [{
    content: {
      type: String,
      required: true
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet' // Assuming repliedBy is a reference to the User model
    }
  }],

  // replies: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Tweet'
  // }]
  
}, { timestamps: true });


const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;

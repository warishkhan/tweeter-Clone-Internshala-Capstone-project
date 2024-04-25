import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import CommentModal from '../component/ReplyTweetModal'
import { faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons'
import test from '../images/Users.png'
import { toast } from 'react-toastify'
import axios from 'axios'
const ReplyTweets = ({reply,twt,getAllTweets}) => {
  const userData = JSON.parse(localStorage.getItem('user'));

  const likeTweet = async (tweetId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/tweet/${tweetId}/like`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      getAllTweets()
      if (response.status === 200) {
        toast.success("Tweet liked successfully");
      }
    } catch (error) {
      console.error("Error liking tweet:", error);
      toast.error(error.message || "Failed to like tweet");
    }
  };

  const unlikeTweet = async (tweetId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/tweet/${tweetId}/unlike`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      getAllTweets()
      if (response.status === 200) {
        toast.success("Tweet unliked successfully");
      } else {
        toast.error("Failed to unlike tweet");
      }
    } catch (error) {
      console.error("Error unliking tweet:", error);
      toast.error(error.message || "Failed to unlike tweet");
    }
  };

  const toggleLike = async (tweetId) => {
    try {
      const isLiked = twt.likes.some(like => like._id === userData._id);
      if (isLiked) {
        // Unlike the tweet
        await unlikeTweet(tweetId);
      } else {
        // Like the tweet
        await likeTweet(tweetId);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error(error.message || "Failed to toggle like");
    }
  };

  const ReTweet = async (tweetId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/tweet/${tweetId}/retweet`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      getAllTweets()
      if (response.status === 200) {
        toast.success("Tweet retweeted successfully");
      } else {
        toast.error("You already retweted this tweet");
      }
    } catch (error) {
      console.error("Error retweet failed:", error);
      toast.error( "You already retweted this tweet");
    }
  }; 

  return (
    <>
        <div className="border border-gray mx-3 list-group-item">
            <div className="row my-2">
            <div className="col-1 me-1 mt-2 d-flex justify-content-center align-items-center p-0" style={{ height:"50px" ,width:"50px", borderRadius:"50%",position:"relative",left:"2%"}}><img src={!twt.tweetedBy.profilePicture ?test : String(`http://localhost:4000/${twt.tweetedBy.profilePicture}`)} alt="img" className="img-fluid m-0" style={{borderRadius:"50%", width:"200px",height:"50px"}}/></div>
            <div className="col-11 ms-1 m-0">
            <p className="m-0"><span className="fw-bold">{twt.tweetedBy.username}</span> - {String(twt.tweetedBy.createdAt).substring(0,10)}</p>
            <p>{reply.content}</p>
            <div className="d-flex justify-content-between mt-1 btn-Like-and-tweet" >
            <p onClick={() => toggleLike(twt._id)}><FontAwesomeIcon className={twt.likes.some(like => like._id === userData._id) ? "text-danger" : "text-dark"} icon={faHeart} /> {twt.likes.length}</p>
              <CommentModal twtId={twt._id} tweeetLenth={twt.replies} getAllTweets={getAllTweets}/>
              <p><FontAwesomeIcon className={twt.retweetBy.some(retwt => retwt._id ===  userData._id) ? "text-success" : "text-dark"} icon={faRetweet} onClick={() => ReTweet(twt._id)} /> {twt.retweetBy.length}</p>
            </div>
            </div>
            </div>
          </div>
    </>
  )
}

export default ReplyTweets
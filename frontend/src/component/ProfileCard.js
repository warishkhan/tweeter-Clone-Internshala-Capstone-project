import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faRetweet, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import CommentModal from './ReplyTweetModal';
import userImg from '../images/Users.png'
import './ProfileCard.Css'

const ProfileCard = ({ twt, getAllTweets,zindex }) => {
  const userData = JSON.parse(localStorage.getItem('user'));

  // handle Delete tweet
  const deleteTweet = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/tweet/${twt._id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
        getAllTweets()
      if (response.status === 200) {
        toast.success("Tweet deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting tweet:", error);
      toast.error(error.message || "Failed to delete tweet");
    }
  };

  // Handle Like tweet
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
      toast.error("You already liked this tweet");
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
        toast.success("Tweet disliked successfully");
      } else {
        toast.error("Failed to dislike tweet");
      }
    } catch (error) {
      console.error("Error disliking tweet:", error);
      toast.error(error.message || "Failed to dislike tweet");
    }
  };

  // handle toggle like/unlike
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

  // handle Retweet
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
    <div className="border border-gray mx-3 list-group-item" style={{zIndex:zindex}}>
      <div className="row BgHover m-0">
        <div className="col-1 me-1 mt-4 d-flex justify-content-center align-items-center p-0" style={{ height: "50px", width: "50px", borderRadius: "50%", position: "relative", left: "2%" }}>
          { twt ? <img src={!twt.tweetedBy.profilePicture ? userImg : String(`http://localhost:4000/${twt.tweetedBy.profilePicture}`)} alt="Profile" className="img-fluid m-0" style={{ borderRadius: "50%", width: "50px", height: "50px" }} /> : "" }

        </div>
        <div className="col-11 ms-1 m-0">
          { twt.retweetBy.length ? <p className='mt-2 mb-0'><FontAwesomeIcon icon={faRetweet}/> Retweeted by <span>{twt.retweetBy[twt.retweetBy.length-1].name}</span> </p> : "" }
          <div>
            { twt.retweetBy.length ? 
              <div className="d-flex justify-content-between">
                <Link className='text-decoration-none text-dark'to={`user/${twt.tweetedBy._id}`}>
                  { twt ? <p className="m-0"><span className="fw-bold">@{twt.tweetedBy.username}</span> - {String(twt.createdAt).substring(0,10)}</p> : "" }
                </Link>
                {
                  twt.tweetedBy._id === userData._id ? 
                  <FontAwesomeIcon className='deleteBtn' icon={faTrash} onClick={deleteTweet} /> : ""
                }
              </div> : 
              <div className="d-flex justify-content-between mt-2">
                <Link className='text-decoration-none text-dark' to={`user/${twt.tweetedBy._id}`}>
                  { twt ? <p className="m-0"><span className="fw-bold">@{twt.tweetedBy.username}</span> - {String(twt.createdAt).substring(0,10)}</p> : "" }
                </Link>
                {
                  twt.tweetedBy._id === userData._id ? 
                  <FontAwesomeIcon className='deleteBtn' icon={faTrash} onClick={deleteTweet} /> : ""
                }
              </div>
            }
          </div>
          
          { twt ? 
            <div>
              <Link to={`/tweet/${twt._id}`} className='text-decoration-none text-dark'>
                <div className='m-0 p-0'><p className='fs-6 text-wrap'>{twt.content}</p></div>
                { twt.image && <img src={twt ? String(`http://localhost:4000/${twt.image}`) :""} alt="Tweet" className="img-fluid" /> }
              </Link>
              <div className="d-flex justify-content-between mt-1 btn-Like-and-tweet">
                 <p onClick={() => toggleLike(twt._id)}><FontAwesomeIcon className={twt.likes.some(like => like._id === userData._id) ? "text-danger BtnPointer" : "text-dark BtnPointer"} icon={faHeart} /> {twt.likes.length}</p>
                <CommentModal twtId={twt._id} tweeetLenth={twt.replies} getAllTweets={getAllTweets}/>
                <p><FontAwesomeIcon className={twt.retweetBy.some(retwt => retwt._id ===  userData._id) ? "text-success BtnPointer" : "text-dark BtnPointer"} icon={faRetweet} onClick={() => ReTweet(twt._id)} /> {twt.retweetBy.length}</p>
              </div>
            </div> : ""
          }
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;




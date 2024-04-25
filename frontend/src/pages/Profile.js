import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCake, faCalendar, faLocation } from "@fortawesome/free-solid-svg-icons";
import EditModal from "../component/EditModal";
import PicUploadMoadl from "../component/PicUploadMoadl";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import test from '../images/Users.png';
import ProfileCard from "../component/ProfileCard";
import './Profile.css'

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // State to track if the logged-in user is following the profile user
  const userData = JSON.parse(localStorage.getItem('user'));
  const [allTweet,setAllTweet] = useState([])

  // All Tweets
  const getAllTweets = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/tweet`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.status === 200) {
        // setTweets(response.data);
        setAllTweet(response.data);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      toast.error(error.message || "Failed to fetch tweets");
    }
  };

  // handle user tweets by id
const userTweetById = allTweet && allTweet.filter((elem)=>{
  return elem.tweetedBy._id === id;
})
// user Details
  const getSingleUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      if (response.status === 200) {
        setUser(response.data.user);
        setIsFollowing(response.data.user.followers.includes(userData._id)); // Check if logged-in user is in the followers list of the profile user
      }
    } catch (error) {
      toast.error("Error fetching user details");
    }
  };

  useEffect(() => {
    getAllTweets()
    getSingleUserDetails(id);
     // eslint-disable-next-line
  }, [id, userData._id]);

  // Handling Follow/Unfollow
  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/user/${id}/follow`, {
        userId: userData._id,
        followUserId: id
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      getAllTweets()
      getSingleUserDetails(id);
      if (response.status === 200) {
        setIsFollowing(true); // Update the state to indicate the user is now following
        toast.success("User followed successfully");
      }
    } catch (error) {
      toast.error("Error following user");
    }
  };

   // Handling Follow/Unfollow
  const handleUnfollow = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/user/${id}/unfollow`, {
        userId: userData._id,
        unfollowUserId: id
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      getAllTweets()
      getSingleUserDetails(id);
      if (response.status === 200) {
        setIsFollowing(false); // Update the state to indicate the user is no longer following
        toast.success("User unfollowed successfully");
      }
    } catch (error) {
      toast.error("Error unfollowing user");
    }
  };

  return (
    <>
      <div className="container" style={{zIndex:-1}}>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-10 border content border-gray">
            <div className="d-flex justify-content-between m-3">
              <p className="fw-bold">Profile</p>
              <p></p>
            </div>
            <div className="mx-3">
              <div className="bgImgContainer"></div>
              <div className="profileImgContainer d-flex justify-content-between align-items-center">
                {user && (
                  <img src={!user.profilePicture ?  test : String(`http://localhost:4000/${user.profilePicture}`)} alt="Profile" className="img-fluid m-0 ms-0 ms-sm-0 ms-md-0 ms-lg-3" style={{ borderRadius: "50%", width: "80px", height: "80px"}} />
                )}
                {userData._id === id ? (
                  <div className="btnContainer m-0 me-0 me-sm-0 me-md-0 me-lg-3 d-flex">
                    <PicUploadMoadl getSingleUserDetails={()=>getSingleUserDetails(id)} getAllTweets={getAllTweets}/>
                    <EditModal getSingleUserDetails={getSingleUserDetails} />
                  </div>
                ) : (
                  <div>
                    {isFollowing ? (
                      <button className="btn btn-dark m-0 me-0 me-sm-0 me-md-0 me-lg-3 btnContainerfollow btnContainer" onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                      <button className="btn btn-dark m-0 me-0 me-sm-0 me-md-0 me-lg-3 btnContainerfollow btnContainer" onClick={handleFollow}>Follow</button>
                    )}
                  </div>
                )}
              </div>
              <div className="infoContainer d-flex justify-content-between">
                <div className="textContainer m-0 ms-0 ms-sm-0 ms-md-0 ms-lg-3">
                  {user && (
                    <>
                      <h3>{user.name}</h3>
                      <p>@{user.username}</p>
                      <div className="userDb-and-Location d-flex justify-content-between">
                        <p className="me-3 m-0"><FontAwesomeIcon icon={faCake} /> <span> DOB {String(user.dateOfBirth).substr(0, 10)}</span></p>
                        <p className="m-0"><FontAwesomeIcon icon={faLocation} /> <span> {user.location}</span></p>
                      </div>
                      <p><FontAwesomeIcon icon={faCalendar} /> <span> Joined {String(user.createdAt).substr(0, 10)}</span></p>
                      <p><span className="fw-bold">{user && user.following ? user.following.length : 0} Following</span> <span className="fw-bold">{user && user.followers ? user.followers.length : 0} Followers</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className='mx-3 fw-bold text-center'>Tweets and Replies</p>
            {/* Render TweetCard component for each tweet */}
            {userTweetById && userTweetById.length && userTweetById.map((tweet) => (
              <ProfileCard key={tweet._id} twt={tweet} getAllTweets={getAllTweets}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;


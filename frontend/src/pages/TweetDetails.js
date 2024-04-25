import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './TweetDetail.css'
import axios from 'axios';
import ReplyTweets from '../component/ReplyTweets';
import { toast } from 'react-toastify';
import ProfileCard from '../component/ProfileCard';

const TweetDetails = ({zindex}) => {
  const {id} = useParams()
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
        setAllTweet(response.data);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      toast.error(error.message || "Failed to fetch tweets");
    }
  };
const userTweetById = allTweet && allTweet.filter((elem)=>{
  return elem._id === id;
})

  useEffect(() => {
   getAllTweets()
  }, [id]);
   
  return (
    <>
    <div className="container"> 
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-10 border content border-gray">
          <div className="d-flex justify-content-between m-3">
            <p className="fw-bold">Tweet</p>
            <p></p>
          </div>
              {userTweetById && userTweetById.length && userTweetById.map((tweet) => (
              <ProfileCard key={tweet._id} twt={tweet} getAllTweets={getAllTweets} zindex={zindex}/>
            ))}
          <p className='mx-3 fw-bold mt-2'>Replies</p>
          {
          userTweetById[0] &&  userTweetById[0].replies.reverse().map((rply)=>(
              <ReplyTweets key={rply._id} reply={rply} twt={userTweetById[0]} getAllTweets={getAllTweets}/>
            ))
          }
          
        </div>
      </div>
    </div>
  </>
  )
}

export default TweetDetails
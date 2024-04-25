import React, { useEffect, useState } from "react";
import PopUpModal from "../component/PopUpModal";
import TweetCard from "../component/TweetCard";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = ({zindex}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);

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
        setTweets(response.data);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      toast.error(error.message || "Failed to fetch tweets");
    }
  };

  useEffect(() => {
    getAllTweets();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "LOGIN_ERROR" });
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-10 border border-gray">
          <div className="d-flex justify-content-between m-3">
            <p>Home</p>
            <PopUpModal getAllTweets={getAllTweets} />
          </div>
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <TweetCard
                key={tweet._id}
                twt={tweet}
                getAllTweets={getAllTweets}
                zindex={zindex}
              />
            ))
          ) : (
            <p>No tweets found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

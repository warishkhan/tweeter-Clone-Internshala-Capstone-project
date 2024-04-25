import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";


const CommentModal = ({ twtId, tweeetLenth,getAllTweets }) => {
  const [message, setMessage] = useState("");
  
// Replying Tweets 
  const handleReplySubmit = async (event, tweetId) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/tweet/${tweetId}/reply`,
        { content: message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      getAllTweets()
      if (response.status === 201) {
        toast.success("Reply posted successfully");
        setMessage("");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error(error.message || "Failed to post reply");
    }
  };

  return (
    <>
      <p style={{zIndex:99}} type="button" data-bs-toggle="modal" data-bs-target="#replyTweetModal">
        <FontAwesomeIcon
          className={
            tweeetLenth && tweeetLenth.length === 0
              ? "text-dark"
              : "text-primary"
          }
          icon={faComment}
        />{" "}
        {tweeetLenth && tweeetLenth.length}
      </p>

      <div
        className="modal fade "
        id="replyTweetModal"
        aria-labelledby="replyTweetModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="replyTweetModalLabel">
                Reply to Tweet
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={(e) => handleReplySubmit(e, twtId)}>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Your reply..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={"reply"}
                  data-bs-dismiss="modal"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;

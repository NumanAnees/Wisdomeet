import React, { useState } from "react";
import { Avatar, Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import "./Answer.css";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../helpers/auth";
import { Link } from "react-router-dom";

const Answer = ({ answer }) => {
  const [likes, setLikes] = useState(answer.likes);
  const [dislikes, setDislikes] = useState(answer.dislikes);
  const [userLiked, setUserLiked] = useState(answer.isLiked);
  const [userDisliked, setUserDisliked] = useState(answer.isDisliked);
  const authToken = getToken();

  const handleLike = async () => {
    try {
      if (userLiked) {
        setLikes(likes - 1);
        setUserLiked(false);
        // call like api to remove like...
        const like = await axios.post(
          `http://localhost:8000/api/answers/${answer.id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(like.data);
      } else {
        setLikes(likes + 1);
        setUserLiked(true);
        // call like api to add like...
        const like = await axios.post(
          `http://localhost:8000/api/answers/${answer.id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(like.data);
        if (userDisliked) {
          setDislikes(dislikes - 1);
          setUserDisliked(false);
          // if disliked already, remove that dislike
          const dislike = await axios.post(
            `http://localhost:8000/api/answers/${answer.id}/dislike`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log(dislike.data);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred");
    }
  };

  const handleDislike = async () => {
    if (userDisliked) {
      setDislikes(dislikes - 1);
      setUserDisliked(false);
      // call like api to remove dislike...
      const dislike = await axios.post(
        `http://localhost:8000/api/answers/${answer.id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(dislike.data);
    } else {
      setDislikes(dislikes + 1);
      setUserDisliked(true);
      // call like api to add duslike...
      const dislike = await axios.post(
        `http://localhost:8000/api/answers/${answer.id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(dislike.data);
      if (userLiked) {
        setLikes(likes - 1);
        setUserLiked(false);
        // if liked already, remove that like...
        const like = await axios.post(
          `http://localhost:8000/api/answers/${answer.id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(like.data);
      }
    }
  };

  return (
    <div className="answer-card-main">
      <div className="answer-card-container">
        <Avatar
          src={answer.picture}
          alt={answer.name}
          size={48}
          className="answer-card-avatar"
        />
        <div>
          <Link className="username-link" to={`/profile/${answer.userId}`}>
            <h4 className="answer-card-name">{answer.name}</h4>
          </Link>
          <span className="answer-card-info">answered:</span>
        </div>
      </div>
      <p className="answer-card-parra">{answer.text}</p>
      <div className="answer-card-body">
        <Button
          icon={<LikeOutlined />}
          type={userLiked ? "primary" : "default"}
          onClick={handleLike}
          className="btn-style"
        >
          {likes}
        </Button>
        <Button
          icon={<DislikeOutlined />}
          type={userDisliked ? "primary" : "default"}
          onClick={handleDislike}
          className="btn-style"
          danger
        >
          {dislikes}
        </Button>
      </div>
    </div>
  );
};

export default Answer;

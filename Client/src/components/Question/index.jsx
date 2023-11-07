import React, { useState } from "react";
import axios from "axios";
import { Card, Avatar, Button, List } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Answer from "../Answer";
import "./Question.css";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../helpers/auth";
import { toast } from "react-toastify";

const Question = ({ question, answers, AnswerBtn }) => {
  const Navigate = useNavigate();
  const [likes, setLikes] = useState(question.likes);
  const [dislikes, setDislikes] = useState(question.dislikes);
  const [userLiked, setUserLiked] = useState(question.isLiked);
  const [userDisliked, setUserDisliked] = useState(question.isDisliked);
  const authToken = getToken();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const showAnswers = () => {
    Navigate(`/question/${question.id}`);
  };

  const handleLike = async () => {
    try {
      if (userLiked) {
        setLikes(likes - 1);
        setUserLiked(false);
        // call like api to remove like...
        const like = await axios.post(
          `${BASE_URL}/questions/${question.id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        setLikes(likes + 1);
        setUserLiked(true);
        // call like api to add like...
        const like = await axios.post(
          `${BASE_URL}/questions/${question.id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (userDisliked) {
          setDislikes(dislikes - 1);
          setUserDisliked(false);
          // if disliked already, remove that dislike
          const dislike = await axios.post(
            `${BASE_URL}/questions/${question.id}/dislike`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
        }
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDislike = async () => {
    if (userDisliked) {
      setDislikes(dislikes - 1);
      setUserDisliked(false);
      // call like api to remove dislike...
      const dislike = await axios.post(
        `${BASE_URL}/questions/${question.id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } else {
      setDislikes(dislikes + 1);
      setUserDisliked(true);
      // call like api to add duslike...
      const dislike = await axios.post(
        `${BASE_URL}/questions/${question.id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (userLiked) {
        setLikes(likes - 1);
        setUserLiked(false);
        // if liked already, remove that like...
        const like = await axios.post(
          `${BASE_URL}/questions/${question.id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }
    }
  };

  return (
    <Card className="question-card">
      <div className="question">
        <div className="question-card-main">
          <Avatar
            src={question.picture}
            alt={question.name}
            size={64}
            className="question-card-avatar"
          />
          <div>
            <Link className="username-link" to={`/profile/${question.userId}`}>
              <h3 className="question-card-username">{question.name}</h3>
            </Link>
            <span className="question-card-info">asked:</span>
          </div>
        </div>
        <p className="question-card-parra">{question.text}</p>
        <div className="question-card-body">
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
          {AnswerBtn && (
            <Button
              className="btn-style"
              onClick={showAnswers}
              icon={<CommentOutlined />}
            >
              Answers
            </Button>
          )}
        </div>
      </div>
      <div className="answers">
        <List
          dataSource={answers}
          renderItem={(answer) => (
            <List.Item>
              <Answer answer={answer} />
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default Question;

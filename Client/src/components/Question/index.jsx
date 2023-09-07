import React, { useState } from "react";
import { Card, Avatar, Button, List } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Answer from "../Answer";
import "./Question.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../helpers/auth";
import { toast } from "react-toastify";
import axios from "axios";

const Question = ({ question, answers, AnswerBtn }) => {
  const Navigate = useNavigate();
  const [likes, setLikes] = useState(question.likes);
  const [dislikes, setDislikes] = useState(question.dislikes);
  const [userLiked, setUserLiked] = useState(question.isLiked);
  const [userDisliked, setUserDisliked] = useState(question.isDisliked);
  const authToken = getToken();

  //show all answers
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
          `http://localhost:8000/api/questions/${question.id}/like`,
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
          `http://localhost:8000/api/questions/${question.id}/like`,
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
            `http://localhost:8000/api/questions/${question.id}/dislike`,
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
        `http://localhost:8000/api/questions/${question.id}/dislike`,
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
        `http://localhost:8000/api/questions/${question.id}/dislike`,
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
          `http://localhost:8000/api/questions/${question.id}/like`,
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
            <h3 className="question-card-username">{question.name}</h3>
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

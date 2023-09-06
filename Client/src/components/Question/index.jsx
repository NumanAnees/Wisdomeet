import React, { useState } from "react";
import { Card, Avatar, Button, List } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Answer from "../Answer";
import "./Question.css";

const Question = ({ question, answers }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const handleLike = () => {
    if (userLiked) {
      setLikes(likes - 1);
      setUserLiked(false);
    } else {
      setLikes(likes + 1);
      setUserLiked(true);
      if (userDisliked) {
        setDislikes(dislikes - 1);
        setUserDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (userDisliked) {
      setDislikes(dislikes - 1);
      setUserDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setUserDisliked(true);
      if (userLiked) {
        setLikes(likes - 1);
        setUserLiked(false);
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
          >
            {dislikes}
          </Button>
          <Button className="btn-style" icon={<CommentOutlined />}>
            Answer
          </Button>
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

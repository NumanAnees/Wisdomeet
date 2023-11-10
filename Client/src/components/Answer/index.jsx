import React, { useState } from "react";
import { Avatar, Button } from "antd";
import { LikeOutlined, DislikeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { handleDislike, handleLike, handleDelete } from "../../helpers/topicHelpers";
import UpdateAnswerModal from "../UpdateAnswer";

import "./Answer.css";

const Answer = ({ answer, disabled, isAnswerOwner, loadData }) => {
  const [likes, setLikes] = useState(answer.likes);
  const [dislikes, setDislikes] = useState(answer.dislikes);
  const [userLiked, setUserLiked] = useState(answer.isLiked);
  const [userDisliked, setUserDisliked] = useState(answer.isDisliked);

  const handleLikeWrapper = () => {
    handleLike(likes, dislikes, userLiked, userDisliked, setLikes, setDislikes, setUserLiked, setUserDisliked, "answers", answer.id);
  };
  const handleDislikeWrapper = () => {
    handleDislike(likes, dislikes, userLiked, userDisliked, setLikes, setDislikes, setUserLiked, setUserDisliked, "answers", answer.id);
  };
  const handleDeleteWrapper = () => {
    handleDelete("answers", answer.id);
    loadData();
  };

  return (
    <div className="answer-card-main">
      {isAnswerOwner && (
        <div className="question-card-buttons">
          <UpdateAnswerModal data={answer} loadData={loadData} />
          <Button icon={<DeleteOutlined />} onClick={handleDeleteWrapper} className="delete-button" size="large" />
        </div>
      )}
      <div className="answer-card-container">
        <Avatar src={answer.picture} alt={answer.name} size={48} className="answer-card-avatar" />
        <div>
          <Link className="username-link" to={`/about/${answer.userId}`}>
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
          onClick={handleLikeWrapper}
          className="btn-style"
          disabled={disabled}
        >
          {likes}
        </Button>
        <Button
          icon={<DislikeOutlined />}
          type={userDisliked ? "primary" : "default"}
          onClick={handleDislikeWrapper}
          className="btn-style"
          danger
          disabled={disabled}
        >
          {dislikes}
        </Button>
      </div>
    </div>
  );
};

export default Answer;

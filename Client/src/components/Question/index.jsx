import React, { useState } from "react";
import { Card, Avatar, Button, List } from "antd";
import { LikeOutlined, DislikeOutlined, CommentOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { handleDislike, handleLike, handleDelete } from "../../helpers/topicHelpers";
import UpdateQuestionModal from "../UpdateQuestion";
import Answer from "../Answer";

import "./Question.css";

const Question = ({ question, answers, AnswerBtn, disabled, isQuestionOwner, isAnswerOwner, loadData }) => {
  const Navigate = useNavigate();
  const [likes, setLikes] = useState(question.likes);
  const [dislikes, setDislikes] = useState(question.dislikes);
  const [userLiked, setUserLiked] = useState(question.isLiked);
  const [userDisliked, setUserDisliked] = useState(question.isDisliked);

  const showAnswers = () => {
    Navigate(`/question/${question.id}`);
  };

  const handleLikeWrapper = () => {
    handleLike(likes, dislikes, userLiked, userDisliked, setLikes, setDislikes, setUserLiked, setUserDisliked, "questions", question.id);
  };
  const handleDislikeWrapper = () => {
    handleDislike(likes, dislikes, userLiked, userDisliked, setLikes, setDislikes, setUserLiked, setUserDisliked, "questions", question.id);
  };
  const handleDeleteWrapper = () => {
    handleDelete("questions", question.id);
    loadData();
  };
  return (
    <Card className="question-card">
      {isQuestionOwner && (
        <div className="question-card-buttons">
          <UpdateQuestionModal data={question} loadData={loadData} />

          <Button icon={<DeleteOutlined />} onClick={handleDeleteWrapper} className="delete-button" size="large" />
        </div>
      )}
      <div className="question">
        <div className="question-card-main">
          <Avatar src={question.picture} alt={question.name} size={64} className="question-card-avatar" />
          <div>
            <Link className="username-link" to={`/about/${question.userId}`}>
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
          {AnswerBtn && (
            <Button className="btn-style" onClick={showAnswers} icon={<CommentOutlined />}>
              Answers
            </Button>
          )}
        </div>
      </div>
      <div className="answers">
        <List
          dataSource={answers}
          renderItem={answer => (
            <List.Item>
              <Answer answer={answer} isAnswerOwner={isAnswerOwner} disabled={disabled || false} loadData={loadData} />
            </List.Item>
          )}
          locale={{
            emptyText: <span style={{ margin: "2rem 0", display: "block" }}>This Question has no Answers</span>,
          }}
        />
      </div>
    </Card>
  );
};

export default Question;

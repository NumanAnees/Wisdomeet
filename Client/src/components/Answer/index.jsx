import React from "react";
import { Avatar, Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import "./Answer.css";

const Answer = ({ answer }) => {
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
          <h4 className="answer-card-name">{answer.name}</h4>
          <span className="answer-card-info">answered:</span>
        </div>
      </div>
      <p className="answer-card-parra">{answer.text}</p>
      <div className="answer-card-body">
        <Button className="btn-style" icon={<LikeOutlined />} type="default">
          {answer.likes}
        </Button>
        <Button className="btn-style" icon={<DislikeOutlined />} type="default">
          {answer.dislikes}
        </Button>
      </div>
    </div>
  );
};

export default Answer;

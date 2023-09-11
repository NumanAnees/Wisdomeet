import React from "react";
import { Link } from "react-router-dom";

import "./home.css";

const TopicCard = (props) => {
  const { topic, left, handleFollowUnfollowBtn } = props;
  return (
    <li className="topic-card">
      <Link to={`/${topic.id}`} className="topic-link">
        <div className="topic-card-main">
          <img
            alt="Topic"
            src={topic.topicPicture}
            className="topic-card-img"
          />
          <h4 className="topic-card-title">{topic.title}</h4>
        </div>
      </Link>

      <div>
        {left ? (
          <button
            className=" btn btn-primary topic-card-btn"
            onClick={() => handleFollowUnfollowBtn(topic.id)}
          >
            Follow
          </button>
        ) : (
          <button
            className=" btn btn-danger topic-card-btn"
            onClick={() => handleFollowUnfollowBtn(topic.id)}
          >
            Unfollow
          </button>
        )}
      </div>
    </li>
  );
};

export default TopicCard;

import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getToken } from "../../helpers/auth";
import { handleFollowUnfollow } from "../../helpers/topicHelpers";
import Question from "../Question";
import QuestionModal from "./QuestionModal";
//import css
import "./topic.css";

const Topic = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState();
  const [Questions, setQuestions] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [isFollowed, setIsFollowed] = useState();

  useEffect(() => {
    getTopic();
  }, [isFollowed]);

  const handleFollowUnfollowBtn = async (id) => {
    await handleFollowUnfollow(id);
    setIsFollowed(!isFollowed);
    getTopic();
  };

  const getTopic = async () => {
    const authToken = getToken();
    try {
      //get topic...
      const topic = await axios.get(`http://localhost:8000/api/topics/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTopic(topic.data.Topic);
      setQuestions(topic.data.Questions);
      setIsFollowed(topic.data.isFollowed);
      //get followers count...
      const followers = await axios.get(
        `http://localhost:8000/api/topics/${id}/followers`
      );
      setFollowersCount(followers.data.followersCount);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="topic-main">
          <div className="topic-image">
            <img
              src={topic?.topicPicture}
              alt={topic?.title}
              className="topic-image"
            />
          </div>
          <div className="topic-content">
            <div className="topic-title">
              <h4>{topic?.title}</h4>
            </div>
            <div className="topic-description">
              <p>{topic?.description}</p>
            </div>
            <div className="topic-followers">Followers: {followersCount}</div>
            <div className="topic-follow-btn">
              {isFollowed ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleFollowUnfollowBtn(id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-info"
                  onClick={() => handleFollowUnfollowBtn(id)}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="topic-questions">
          <div className="topic-questions-title">
            <h4>Questions</h4>
            <div className="topic-questions-btn">
              <QuestionModal getTopic={getTopic} />
            </div>
          </div>
          <div className="topic-questions-content">
            {Questions &&
              Questions.map((item) => {
                return (
                  <Question
                    key={item.question.id}
                    question={item.question}
                    answers={item.answers}
                    AnswerBtn={true}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Topic;

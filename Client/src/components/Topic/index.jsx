import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getToken } from "../../helpers/auth";
import { handleFollowUnfollow } from "../../helpers/topicHelpers";
import Question from "../Question";
import QuestionModal from "./QuestionModal";
import { Pagination } from "antd";

//import css
import "./topic.css";

const Topic = () => {
  const { id } = useParams();
  const BASE_URL = process.env.BASE_API;
  const [topic, setTopic] = useState();
  const [Questions, setQuestions] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [isFollowed, setIsFollowed] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 2;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  let currentQuestions;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    getTopic();
    if (Questions) {
      currentQuestions = Questions.slice(startIndex, endIndex);
    }
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
      const topic = await axios.get(`${BASE_URL}/topics/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTopic(topic.data.Topic);
      setQuestions(topic.data.Questions);
      setIsFollowed(topic.data.isFollowed);
      //get followers count...
      const followers = await axios.get(`${BASE_URL}/topics/${id}/followers`);
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
            <div className="topic-follow-btn ">
              <div className="m-2">
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
              <button className="btn btn-secondary m-2">
                {followersCount} Followers
              </button>
            </div>
          </div>
        </div>
        <div className="topic-questions">
          <div className="topic-questions-title">
            <h4 className="question-title">Questions</h4>
            <div className="topic-questions-btn">
              <QuestionModal getTopic={getTopic} />
            </div>
          </div>
          <div className="topic-questions-content">
            {currentQuestions &&
              currentQuestions.map((item, index) => {
                return (
                  <Question
                    key={index}
                    question={item.question}
                    answers={item.answers}
                    AnswerBtn={true}
                  />
                );
              })}

            <Pagination
              current={currentPage}
              pageSize={questionsPerPage}
              total={Questions && Questions.length}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Topic;

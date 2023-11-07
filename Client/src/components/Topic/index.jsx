import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { toast } from "react-toastify";
import { getToken } from "../../helpers/auth";
import { DeleteOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import { handleFollowUnfollow } from "../../helpers/topicHelpers";
import Question from "../Question";
import QuestionModal from "./QuestionModal";
import NoDataMessage from "../NoDataMessage";
import UpdateTopic from "../UpdateTopic/index.jsx";
//import css
import "./topic.css";

const Topic = () => {
  const { id } = useParams();
  const editButtonRef = useRef(null);
  const Navigate = useNavigate();
  const [topic, setTopic] = useState();
  const [Questions, setQuestions] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [isFollowed, setIsFollowed] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isOwner, setIsOwner] = useState();
  const questionsPerPage = 2;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = Questions && Questions.slice(startIndex, endIndex);
  const BASE_URL = process.env.REACT_APP_BASE_API;
  const authToken = getToken();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    getTopic();
  }, [isFollowed]);

  const handleFollowUnfollowBtn = async (id) => {
    await handleFollowUnfollow(id);
    setIsFollowed(!isFollowed);
    getTopic();
  };

  const handleDelete = async () => {
    try {
      const request = await axios.delete(`${BASE_URL}/topics/${topic.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (request.status == 200 || request.status == 201) {
        toast.success("Topic deleted successfully");
        Navigate("/");
      }
    } catch (err) {
      toast.error("Error deleting");
      console.log(err);
    }
  };

  const getTopic = async () => {
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
      setIsOwner(topic.data.isOwner);
      //get followers count...
      const followers = await axios.get(`${BASE_URL}/topics/${id}/followers`);
      setFollowersCount(followers.data.followersCount);
    } catch (error) {
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
              {isOwner && (
                <div className="topic-card-buttons">
                  <UpdateTopic data={topic} ref={editButtonRef} />

                  <Button
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    className="delete-button"
                    size="large"
                  />
                </div>
              )}
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
            {currentQuestions?.length > 0 ? (
              currentQuestions.map((item, index) => {
                return (
                  <Question
                    key={index}
                    question={item.question}
                    answers={item.answers}
                    AnswerBtn={true}
                    disabled={true}
                  />
                );
              })
            ) : (
              <NoDataMessage text="Question to show..." />
            )}
            {currentQuestions?.length > 0 && (
              <Pagination
                current={currentPage}
                pageSize={questionsPerPage}
                total={Questions && Questions.length}
                onChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Topic;

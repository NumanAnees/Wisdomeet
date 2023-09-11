import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "../Layout";
import TopicCard from "./TopicCard";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../helpers/auth";
import { handleFollowUnfollow } from "../../helpers/topicHelpers";
import Question from "../Question";
import TopicModalComponent from "./TopicModal";
import SearchModal from "./SearchModal";

//css imports
import "./home.css";

const Home = () => {
  const [following, setFollowing] = useState();
  const [notFollowing, setNotFollowing] = useState();
  const [Questions, setQuestions] = useState();
  const [IsSearchOpen, setIsSearchOpen] = useState();
  const BASE_URL = process.env.BASE_API;

  const getTopics = async () => {
    const authToken = getToken();
    try {
      //request for all topics excluding the following ones
      const AllTopics = await axios.get(`${BASE_URL}/topics`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setNotFollowing(AllTopics.data);
      //request for topics following
      const Topics = await axios.get(`${BASE_URL}/topics/followed`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setFollowing(Topics.data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("There was a problem with the request:", error);
    }
  };
  //follow unfollow handler
  const handleFollowUnfollowBtn = async (id) => {
    try {
      await handleFollowUnfollow(id);
      //update the following and notFollowing
      getTopics();
      getQuestions();
    } catch (err) {
      console.error("There was a problem with the request:", err);
      toast.error("Something went wrong!");
    }
  };
  const getQuestions = async () => {
    const authToken = getToken();

    try {
      const questions = await axios.get(`${BASE_URL}/questions/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // console.log(questions.data);
      setQuestions(questions.data);
    } catch (err) {
      console.error("There was a problem with the request:", err);
      toast.error("Something went wrong!");
    }
  };

  const handleClear = () => {
    setIsSearchOpen(false);
    getQuestions();
  };

  useEffect(() => {
    getTopics();
    getQuestions();
  }, []);

  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col xs={3} className="left-column">
            <div className="d-flex justify-content-between">
              <h2 className="heading-main">All Topics</h2>
              <TopicModalComponent getTopics={getTopics} />
            </div>
            {notFollowing &&
              notFollowing.map((topic) => {
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    handleFollowUnfollowBtn={handleFollowUnfollowBtn}
                    left={true}
                  />
                );
              })}
          </Col>
          <Col xs={6} className="center-column">
            <div className="mt-2 mb-2 d-flex justify-content-between sticky-header">
              <h2 className="heading-main">All Questions:</h2>
              {IsSearchOpen ? (
                <button className="nav-btn" onClick={handleClear}>
                  Clear
                </button>
              ) : (
                <SearchModal
                  setQuestions={setQuestions}
                  setIsSearchOpen={setIsSearchOpen}
                />
              )}
            </div>
            <div style={{ height: "1000px" }}>
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
          </Col>
          <Col xs={3} className="right-column">
            <h2 className="heading-main">Followed Topics</h2>
            {following &&
              following.map((topic) => {
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    handleFollowUnfollowBtn={handleFollowUnfollowBtn}
                    left={false}
                  />
                );
              })}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Home;

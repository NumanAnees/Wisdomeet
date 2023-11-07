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
//css imports
import "./home.css";

const Home = () => {
  const [following, setFollowing] = useState();
  const [notFollowing, setNotFollowing] = useState();
  const [Questions, setQuestions] = useState();

  const getTopics = async () => {
    const authToken = getToken();
    try {
      //request for all topics excluding the following ones
      const AllTopics = await axios.get("http://localhost:8000/api/topics", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setNotFollowing(AllTopics.data);
      //request for topics following
      const Topics = await axios.get(
        "http://localhost:8000/api/topics/followed",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
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
      const questions = await axios.get(
        "http://localhost:8000/api/questions/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // console.log(questions.data);
      setQuestions(questions.data);
    } catch (err) {
      console.error("There was a problem with the request:", err);
      toast.error("Something went wrong!");
    }
  };

  //delete this...................
  // const dummyQuestion = {
  //   id: 1,
  //   name: "John Doe",
  //   picture: "https://example.com/johndoe-avatar.jpg",
  //   text: "What is the capital of France?",
  //   likes: 5,
  //   dislikes: 1,
  // };

  // const dummyAnswers = [
  //   {
  //     id: 1,
  //     name: "Alice Smith",
  //     picture: "https://example.com/alicesmith-avatar.jpg",
  //     text: "The capital of France is Paris.",
  //     likes: 5,
  //     dislikes: 1,
  //   },
  //   {
  //     id: 2,
  //     name: "Bob Johnson",
  //     picture: "https://example.com/bobjohnson-avatar.jpg",
  //     text: "Yes, it's Paris.",
  //     likes: 3,
  //     dislikes: 0,
  //   },
  //   {
  //     id: 3,
  //     name: "Eva Williams",
  //     picture: "https://example.com/evawilliams-avatar.jpg",
  //     text: "I think it's Paris too.",
  //     likes: 2,
  //     dislikes: 0,
  //   },
  // ];

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
              <h2>All Topics</h2>
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
            <h2 className="mt-2">All Questions:</h2>
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
            <h2>Followed Topics</h2>
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

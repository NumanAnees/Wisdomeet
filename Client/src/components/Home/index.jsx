import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "../Layout";
import TopicCard from "./TopicCard";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../helpers/auth";
import { handleFollowUnfollow } from "../../helpers/topicHelpers";

//css imports
import "./home.css";

const Home = () => {
  const [following, setFollowing] = useState();
  const [notFollowing, setNotFollowing] = useState();

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
      //   console.log(Topics.data);
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
    } catch (err) {
      console.error("There was a problem with the request:", err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getTopics();
  }, []);

  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col xs={3} className="left-column">
            <h2>All Topics</h2>
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
            <h2>Center Column</h2>
            <p>
              This is the center column with a lot of content that will make it
              scrollable. You can add more text here to test the scroll
              behavior.
            </p>
            <div style={{ height: "1000px" }}>{/*content*/}</div>
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

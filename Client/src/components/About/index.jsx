import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getUser as CurrentUser } from "../../helpers/auth";
import { get } from "../../helpers/axiosHelper";
import Layout from "../Layout";
import QuestionAnswerTab from "../Profile/QuestionAnswerTab";
import TopicTab from "../Profile/TopicTab";

import "./About.css";

const About = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [Questions, setQuestions] = useState();
  const [Answers, setAnswers] = useState();
  const [topics, setTopics] = useState();
  const Navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    if (CurrentUser().id == id) {
      Navigate("/profile");
    }
    getUser();
  }, [id]);

  const getUser = async () => {
    try {
      const request = await get(`${BASE_URL}/user/about/${id}`);

      const user = {
        id: request.data.id,
        name: request.data.name,
        email: request.data.email,
        age: request.data.age,
        profilePic: request.data.profilePic,
        gender: request.data.gender,
      };
      setAnswers(request.data.answer_posted);
      setQuestions(request.data.questions_posted);
      setTopics(request.data.followedTopics);
      setUser(user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div className="user-questions-title">
          <h5>Followed Topics</h5>
        </div>
      ),
      children: <TopicTab topics={topics} getUser={getUser} />,
    },
    {
      key: "2",
      label: (
        <div className="user-questions-title">
          <h5>Asked Questions</h5>
        </div>
      ),
      children: <QuestionAnswerTab Questions={Questions} />,
    },
    {
      key: "3",
      label: (
        <div className="user-questions-title">
          <h5>Posted Answers</h5>
        </div>
      ),
      children: <QuestionAnswerTab Questions={Answers} />,
    },
  ];
  return (
    <Layout>
      <div className="container">
        <div className="user-main">
          <div className="user-image">
            <img src={user?.profilePic} alt={user?.name} className="user-image" />
          </div>
          <div className="user-content">
            <div className="user-title">
              <h4>{user?.name}</h4>
            </div>
            <div className="user-information">
              <p>
                <span className="user-span">Email:</span> {user?.email}
              </p>
            </div>
            <div className="user-information">
              <p>
                <span className="user-span">Age: </span>
                {user?.age}
              </p>
            </div>
            <div className="user-information">
              <p>
                <span className="user-span">Gender:</span> {user?.gender}
              </p>
            </div>
          </div>
        </div>
        <div className="tabs">
          <Tabs type="card" items={items} tabBarStyle={{ color: "gray" }} />
        </div>
      </div>
    </Layout>
  );
};

export default About;

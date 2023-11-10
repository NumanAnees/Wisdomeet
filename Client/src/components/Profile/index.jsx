import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Tabs } from "antd";

import { get } from "../../helpers/axiosHelper";
import QuestionAnswerTab from "./QuestionAnswerTab";
import TopicTab from "./TopicTab";
import Layout from "../Layout";

import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState();
  const [Questions, setQuestions] = useState();
  const [Answers, setAnswers] = useState();
  const [topics, setTopics] = useState();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const request = await get(`${BASE_URL}/user/about`);

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
      children: <QuestionAnswerTab isOwner={true} isQuestionOwner={true} Questions={Questions} loadData={getUser} />,
    },
    {
      key: "3",
      label: (
        <div className="user-questions-title">
          <h5>Posted Answers</h5>
        </div>
      ),
      children: <QuestionAnswerTab isAnswerOwner={true} Questions={Answers} loadData={getUser} />,
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

export default Profile;

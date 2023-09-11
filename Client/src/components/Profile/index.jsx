import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getToken } from "../../helpers/auth";
import { Tabs } from "antd";
import QuestionAnswerTab from "./QuestionAnswerTab";
import TopicTab from "./TopicTab";

//import css
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [Questions, setQuestions] = useState();
  const [Answers, setAnswers] = useState();
  const [topics, setTopics] = useState();

  console.log("working", id);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const authToken = getToken();
    try {
      let request;
      if (!id) {
        request = await axios.get("http://localhost:8000/api/user/about", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        request = await axios.get(
          `http://localhost:8000/api/user/about/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }
      console.log(request.data);
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
      console.log(error);
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
      children: <QuestionAnswerTab Questions={Answers} />, //will use the same component...
    },
  ];

  return (
    <Layout>
      <div className="container">
        <div className="user-main">
          <div className="user-image">
            <img
              src={user?.profilePic}
              alt={user?.name}
              className="user-image"
            />
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

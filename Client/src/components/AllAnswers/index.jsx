import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getToken } from "../../helpers/auth";
import Question from "../Question";
import AnswerModal from "./AnswerModal";

//import css
import "./AllAnswers.css";

const AllAnswers = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    getAnswers();
  }, []);

  const getAnswers = async () => {
    const authToken = getToken();
    try {
      //get topic...
      const answers = await axios.get(`${BASE_URL}/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setQuestion(answers.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="topic-questions">
          <div className="topic-questions-title">
            <h4 className="question-title">Question</h4>
            <div className="topic-questions-btn">
              <AnswerModal getAnswers={getAnswers} />
            </div>
          </div>
          <div className="topic-questions-content">
            {question && (
              <Question
                key={question.question.id}
                question={question.question}
                answers={question.answers}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllAnswers;

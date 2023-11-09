import React from "react";
import Question from "../Question";

const QuestionAnswerTab = ({ Questions }) => {
  return (
    <div className="user-questions">
      <div className="user-questions-content">
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
  );
};

export default QuestionAnswerTab;

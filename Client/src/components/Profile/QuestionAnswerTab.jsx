import React from "react";
import Question from "../Question";
import NoDataMessage from "../NoDataMessage";

const QuestionAnswerTab = ({ Questions, isQuestionOwner, isAnswerOwner, loadData }) => {
  <div className="user-questions">
    <div className="user-questions-content">
      {Questions?.length > 0 ? (
        Questions.map(item => {
          <Question
            key={item.question.id}
            question={item.question}
            answers={item.answers}
            AnswerBtn={true}
            disabled={true}
            isQuestionOwner={isQuestionOwner}
            isAnswerOwner={isAnswerOwner}
            loadData={loadData}
          />;
        })
      ) : (
        <NoDataMessage text="data to show..." />
      )}
    </div>
  </div>;
};

export default QuestionAnswerTab;

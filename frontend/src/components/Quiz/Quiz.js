import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useLocation } from "react-router-dom";
import "./QuizCard.css";

const FETCH_QUESTIONS = gql`
  query ($category: String!) {
    fetchQuestions(category: $category) {
      question
      ans
      options
    }
  }
`;

export default function Quiz() {
  const location = useLocation();
  const { category, user } = location.state;
  console.log("the user is: ", user);
  const { data, loading, error } = useQuery(FETCH_QUESTIONS, {
    variables: { category },
  });

  if (loading) return "Loading..";
  if (error) return "Error";

  const fetchedQuestions = data.fetchQuestions;

  function handleOptionClick(optionSelected) {}

  function quizCard({ question, options }) {
    return (
      <div className="quiz-card-container">
        <div>TIMER SLIDER</div>
        <hr />
        <p className="question">{question}</p>

        <div className="options">
          {options.map((option, index) => (
            <button
              key={index}
              className="option"
              onClick={handleOptionClick.bind(this, option)}>
              <p>{option}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {fetchedQuestions && quizCard(fetchedQuestions[0])}
    </div>
  );
}

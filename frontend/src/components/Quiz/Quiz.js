import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { categoryActions } from "../../store/slices/category-slice";
import "./QuizCard.css";

const FETCH_CATEGORY = gql`
  query ($code: Int!) {
    fetchCategory(code: $code)
  }
`;

const FETCH_QUESTIONS = gql`
  query ($category: String!) {
    fetchQuestions(category: $category) {
      question
      ans
      options
    }
  }
`;

const ADD_ANSWER = gql`
  mutation (
    $code: Int!
    $user: String!
    $answer: String!
    $score: Int!
    $question: Int!
  ) {
    addAnswer(
      code: $code
      user: $user
      answer: $answer
      score: $score
      question: $question
    ) {
      statusCode
      message
    }
  }
`;

export default function Quiz() {
  const [currentScore, setCurrentScore] = useState(0);
  const category = useSelector((state) => state.category.selectedCategory);
  const user = useSelector((state) => state.category.user);

  console.log("the redux data is: ", category, user);

  const { data, loading, error } = useQuery(FETCH_QUESTIONS, {
    variables: { category },
  });

  const [submitAnswer] = useMutation(ADD_ANSWER);

  if (loading) return "Loading..";
  if (error) return "Error";

  const fetchedQuestions = data.fetchQuestions;
  console.log("fetched questions are: ", fetchedQuestions);

  function handleOptionClick(optionSelected, ans, index) {
    submitAnswer({
      variables: {
        code: 5678,
        user,
        answer: optionSelected,
        score: ans === optionSelected ? currentScore + 1 : currentScore,
        question: index,
      },
    });
  }

  function quizCard({ question, options, ans }) {
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
              onClick={handleOptionClick.bind(this, option, ans, index + 1)}>
              <p>{option}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {fetchedQuestions &&
        fetchedQuestions.length > 0 &&
        quizCard(fetchedQuestions[0])}
    </div>
  );
}

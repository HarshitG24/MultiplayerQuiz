import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { quizActions } from "../../store/slices/quiz-slice";
import "./QuizCard.css";

const FETCH_QUIZ_DATA = gql`
  query ($code: Int!) {
    fetchQuizData(code: $code) {
      category
      questions {
        question
        options
        ans
      }
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
      user1Score
      user2Score
    }
  }
`;

const ANS_SUB = gql`
  subscription ($code: Int!) {
    optionSelected(code: $code) {
      user1Score
      user2Score
      user1Ans {
        answer
      }
      user2Ans {
        answer
      }
    }
  }
`;

export default function Quiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const index = useSelector((state) => state.quiz.index);
  const currentScore = useSelector((state) => state.quiz.currentScore);
  const opponentScore = useSelector((state) => state.quiz.opponentScore);
  const currentAnswer = useSelector((state) => state.quiz.currentAnswer);
  const opponentAnswer = useSelector((state) => state.quiz.opponentAnswer);

  // const [currentScore, setCurrentScore] = useState(0);
  const category = useSelector((state) => state.category.selectedCategory);
  const user = useSelector((state) => state.category.user);

  const { data, loading, error } = useQuery(FETCH_QUIZ_DATA, {
    variables: { category, code: 5678 },
  });

  const [submitAnswer] = useMutation(ADD_ANSWER);

  const subData = useSubscription(ANS_SUB, {
    variables: { code: 5678 },
  });

  if (subData !== undefined) {
    if (subData?.data?.optionSelected) {
      const { user1Score, user2Score, user1Ans, user2Ans } =
        subData.data.optionSelected;

      if (user1Ans.length === index + 1 && user2Ans.length === index + 1) {
        if (user === "user1") {
          dispatch(quizActions.setCurrentScore(user1Score));
          dispatch(quizActions.setOpponentAnswer(user2Ans[index].answer));
          dispatch(quizActions.setOpponentScore(user2Score));
        } else {
          dispatch(quizActions.setCurrentScore(user2Score));
          dispatch(quizActions.setOpponentAnswer(user1Ans[index].answer));
          dispatch(quizActions.setOpponentScore(user1Score));
        }

        setTimeout(() => {
          dispatch(quizActions.setAnswer(""));
          dispatch(quizActions.setOpponentAnswer(""));
          if (index <= 3) dispatch(quizActions.setCurrentIndex(index + 1));
          else navigate("/result");
        }, 3000);
      }
    }
  }

  if (loading) return "Loading..";
  if (error) return "Error";

  const fetchedQuestions = data.fetchQuizData.questions;

  function handleOptionClick(optionSelected, ans, index) {
    dispatch(quizActions.setAnswer(optionSelected));
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

  setInterval(() => {
    if (index <= 3) dispatch(quizActions.setCurrentIndex(index + 1));
    else navigate("/result");
  }, 30000);

  function quizCard({ question, options, ans }) {
    const style = ["option"];
    return (
      <div className="quiz-card-container">
        <div>TIMER SLIDER</div>
        <hr />
        <p className="question">{question}</p>

        <div className="options">
          {options.map((option, index) => {
            return (
              <button
                disabled={currentAnswer !== ""}
                className={[
                  `option ${option === currentAnswer ? "my-answer" : null} ${
                    option === opponentAnswer ? "opponent-answer" : null
                  } ${
                    currentAnswer && opponentAnswer && option === ans
                      ? "correct-answer"
                      : null
                  } `,
                ]}
                key={index}
                onClick={handleOptionClick.bind(this, option, ans, index + 1)}>
                <p>{option}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {fetchedQuestions &&
        fetchedQuestions.length > 0 &&
        quizCard(fetchedQuestions[index])}
      <div>
        <div>
          <p>Your Score</p>
          <p>{currentScore}</p>
        </div>
        <div>
          <p>Opponent Score</p>
          <p>{opponentScore}</p>
        </div>
      </div>
    </div>
  );
}

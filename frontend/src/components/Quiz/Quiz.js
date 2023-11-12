import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { quizActions } from "../../store/slices/quiz-slice";
import "./QuizCard.css";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import QuizCard from "./QuizCard";

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
  const category = useSelector((state) => state.category.selectedCategory);
  const user = useSelector((state) => state.category.user);
  const code = useSelector((state) => state.game.code);

  const { data, loading, error, subscribeToMore } = useQuery(FETCH_QUIZ_DATA, {
    variables: { category, code },
  });

  const startSubscription = () => {
    subscribeToMore({
      document: ANS_SUB,
      variables: { code },
      updateQuery: (prev, { subscriptionData }) => {
        if (subscriptionData !== undefined) {
          if (subscriptionData?.data?.optionSelected) {
            const { user1Score, user2Score, user1Ans, user2Ans } =
              subscriptionData.data.optionSelected;

            if (
              user1Ans.length === index + 1 &&
              user2Ans.length === index + 1
            ) {
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
                dispatch(quizActions.setCurrentIndex(index + 1));
                if (index > 3) navigate("/result");
              }, 3000);
            }
          }
        }
      },
    });
  };

  loadDevMessages();
  loadErrorMessages();

  useEffect(() => {
    startSubscription();
  });

  if (loading) return "Loading..";
  if (error) return "Error";

  const fetchedQuestions = data.fetchQuizData.questions;

  if (index > 4) return;

  return (
    <div className="quiz-container">
      {fetchedQuestions && fetchedQuestions.length > 0 && (
        <QuizCard data={fetchedQuestions[index]} />
      )}
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

import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { quizActions } from "../../store/slices/quiz-slice";

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

export default function QuizCard({ data }) {
  const { question, options, ans } = data;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.category.user);
  const code = useSelector((state) => state.game.code);
  const currentScore = useSelector((state) => state.quiz.currentScore);
  const currentAnswer = useSelector((state) => state.quiz.currentAnswer);
  const opponentAnswer = useSelector((state) => state.quiz.opponentAnswer);
  const [submitAnswer] = useMutation(ADD_ANSWER);

  function handleOptionClick(optionSelected, ans, index) {
    dispatch(quizActions.setAnswer(optionSelected));
    submitAnswer({
      variables: {
        code,
        user,
        answer: optionSelected,
        score: ans === optionSelected ? currentScore + 1 : currentScore,
        question: index,
      },
    });
  }

  return (
    <div className="quiz-card-container">
      <div>TIMER SLIDER</div>
      <hr />
      <p className="question">{question}</p>

      <div className="options">
        {options &&
          options.map((option, index) => {
            return (
              <button
                disabled={currentAnswer !== ""}
                className={[
                  `option ${
                    option === currentAnswer ? "option-cursor my-answer" : null
                  } ${option === opponentAnswer ? "opponent-answer" : null} ${
                    currentAnswer && opponentAnswer && option === ans
                      ? "correct-answer"
                      : null
                  } ${
                    currentAnswer !== "" && opponentAnswer === ""
                      ? option !== currentAnswer
                        ? "option-cursor waiting"
                        : null
                      : null
                  }`,
                ]}
                key={index}
                onClick={handleOptionClick.bind(this, option, ans, index)}>
                <p>{option}</p>
              </button>
            );
          })}
      </div>
    </div>
  );
}

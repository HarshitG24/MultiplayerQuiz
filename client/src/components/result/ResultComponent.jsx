import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import award from "../../assets/award.png";
import failed from "../../assets/failed.png";
import draw from "../../assets/draw.png";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import "./Result.css";

export default function ResultComponent() {
  const navigate = useNavigate();
  const currentScore = useSelector((state) => state.quiz.currentScore);
  const opponentScore = useSelector((state) => state.quiz.opponentScore);

  function handleBtnClick() {
    navigate("/categories");
  }

  let matchDecision;
  let decisionImage;
  let decisionParagraph;

  if (currentScore === opponentScore) {
    matchDecision = "Draw!";
    decisionImage = draw;
    decisionParagraph = "That was so close! You came so close to win!";
  } else if (currentScore > opponentScore) {
    matchDecision = "You Win";
    decisionImage = award;
    decisionParagraph = "Well Done! Continue your winning streak in future";
  } else {
    matchDecision = "You Loose";
    decisionImage = failed;
    decisionParagraph = "Don't give up! Better luck next time";
  }

  return (
    <div className="result-container">
      <h2>{matchDecision}</h2>
      <img src={decisionImage} alt="This is decision icon" className="award" />
      <label>{decisionParagraph}</label>
      <div className="result-container-button">
        <PrimaryButton type="primary" onClick={handleBtnClick}>
          Go to Categories
        </PrimaryButton>
      </div>
    </div>
  );
}

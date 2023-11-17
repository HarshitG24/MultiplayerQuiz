import React from "react";
import { useSelector } from "react-redux";
import award from "../../assets/award.png";
import failed from "../../assets/failed.png";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import "./Result.css";

export default function ResultComponent() {
  const currentScore = useSelector((state) => state.quiz.currentScore);
  const opponentScore = useSelector((state) => state.quiz.opponentScore);
  return (
    <div className="result-container">
      <h2>{`You ${currentScore > opponentScore ? "Win" : "Loose"}`}</h2>
      {currentScore > opponentScore ? (
        <img src={award} alt="This is trophy icon" className="award" />
      ) : (
        <img src={failed} alt="This is trophy icon" className="award" />
      )}
      <label>{`${
        currentScore > opponentScore
          ? "Don't give up! Better luck next time"
          : "Well Done! Continue your winning streak in future"
      }`}</label>
      <div className="result-container-button">
        <PrimaryButton type="primary">Go to DashBoard</PrimaryButton>
      </div>
    </div>
  );
}

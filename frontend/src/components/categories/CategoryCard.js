import React, { useState } from "react";
import logo from "../../assets/dream-gown.jpg";
import "./CategoryCard.css";

export default function CategoryCard({ question }) {
  const { category } = question;
  const [style, setStyle] = useState({ display: "none" });

  function handleMouseEnter() {
    setStyle((style) => ({ ...style, display: "yes" }));
  }
  function handleMouseExit() {
    setStyle((style) => ({ ...style, display: "none" }));
  }

  function handleJoinGame(event) {
    event.preventDefault();
  }
  function handleStartGame(event) {
    event.preventDefault();
  }

  return (
    <div
      className="product"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseExit}>
      <img src={logo} alt="This is the topic illustration" />
      <div className="category-details">
        <h3>{category}</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod debitis
          esse voluptatem commodi modi reprehenderit vitae iusto harum! Nulla,
          fugit repudiandae! Numquam nihil voluptas perspiciatis ex praesentium,
          qui nobis corrupti?
        </p>
      </div>
      <div
        className={`game-options ${
          style.display === "none"
            ? "game-option-no-display"
            : "game-option-display"
        }`}>
        <button onClick={handleJoinGame}>Join</button>
        <button onClick={handleStartGame}>Start</button>
      </div>
    </div>
  );
}

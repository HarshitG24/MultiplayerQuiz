import { gql, useMutation, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/dream-gown.jpg";
import "./CategoryCard.css";

const START_GAME = gql`
  mutation ($email: String!, $category: String!, $code: Int!) {
    startGame(email: $email, category: $category, code: $code) {
      users
      code
      category
    }
  }
`;

const JOIN_GAME = gql`
  mutation ($code: Int!, $email: String!) {
    joinGame(code: $code, email: $email) {
      code
      category
      users
    }
  }
`;

const GAME_SUBSCRIPTION = gql`
  subscription ($code: Int!) {
    gameOn(code: $code) {
      code
      category
      users
    }
  }
`;

export default function CategoryCard({ data }) {
  const nav = useNavigate();
  const [joinResp] = useMutation(JOIN_GAME);
  const [startResp] = useMutation(START_GAME);
  const subData = useSubscription(GAME_SUBSCRIPTION, {
    variables: { code: 1234 },
  });

  const [chosenCategory, setChosenVCategory] = useState("");

  const [style, setStyle] = useState({ display: "none" });

  function handleMouseEnter() {
    setStyle((style) => ({ ...style, display: "yes" }));
  }
  function handleMouseExit() {
    setStyle((style) => ({ ...style, display: "none" }));
  }

  function handleJoinGame(event, category) {
    event.preventDefault();

    joinResp({
      variables: {
        code: 1234,
        email: "qaz@wsx.com",
      },
    }).then(() => {
      setChosenVCategory(category);
    });
  }

  function handleStartGame(event, category) {
    event.preventDefault();

    startResp({
      variables: {
        code: 1234,
        email: "wsx@wsx.com",
        category,
      },
    }).then(() => {
      setChosenVCategory(category);
    });
  }

  if (subData !== undefined && subData?.data?.gameOn?.users?.length === 2) {
    nav("/quiz", { state: { category: chosenCategory } });
  }

  return (
    <>
      {data &&
        data.questions.map(({ category }) => (
          <div
            className="product"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}>
            {" "}
            <img src={logo} alt="This is the topic illustration" />
            <div className="category-details">
              <h3>{category}</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                debitis esse voluptatem commodi modi reprehenderit vitae iusto
                harum! Nulla, fugit repudiandae! Numquam nihil voluptas
                perspiciatis ex praesentium, qui nobis corrupti?
              </p>
            </div>
            <div
              className={`game-options ${
                style.display === "none"
                  ? "game-option-no-display"
                  : "game-option-display"
              }`}>
              <button onClick={(e) => handleJoinGame(e, category)}>Join</button>
              <button onClick={(e) => handleStartGame(e, category)}>
                Start
              </button>
            </div>
          </div>
        ))}
    </>
  );
}

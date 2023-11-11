import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/dream-gown.jpg";
import { categoryActions } from "../../store/slices/category-slice";
import { gameActions } from "../../store/slices/game-slice";
import "./CategoryCard.css";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useEffect } from "react";

export default function CategoryCard({ categoryData }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const code = useSelector((state) => state.game.code);

  // const [startResp] = useMutation(START_GAME);

  // function handleStartGame(category) {
  //   const code = generateGameCode();
  //   dispatch(gameActions.setGameCode(code));
  //   dispatch(gameActions.toggleModal());
  //   dispatch(gameActions.setModalType("start"));

  //   startResp({
  //     variables: {
  //       code,
  //       email: "wsx@wsx.com",
  //       category,
  //     },
  //   }).then(() => {
  //     dispatch(categoryActions.addCategory(category));
  //     dispatch(categoryActions.setUser("user1"));
  //   });
  // }

  function handleStartGame(category) {
    dispatch(gameActions.setModalType("start"));
    dispatch(gameActions.toggleModal());
    dispatch(categoryActions.addCategory(category));
  }

  return (
    <>
      {categoryData &&
        categoryData.questions.map(({ category }) => (
          <div className="product" key={category}>
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
            <div className="start-game">
              <button onClick={handleStartGame.bind(this, category)}>
                Start
              </button>
            </div>
          </div>
        ))}
    </>
  );
}

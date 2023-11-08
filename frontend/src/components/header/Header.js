import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../../store/slices/category-slice";
import { gameActions } from "../../store/slices/game-slice";
import "./Header.css";

const JOIN_GAME = gql`
  mutation ($code: Int!, $email: String!) {
    joinGame(code: $code, email: $email) {
      code
      category
      users
    }
  }
`;

export default function Header() {
  const dispatch = useDispatch();
  const [joinResp] = useMutation(JOIN_GAME);
  const email = useSelector((state) => state.auth.email);
  const code = useSelector((state) => state.game.code);

  function handleJoinGame() {
    dispatch(gameActions.setModalType("join"));
    dispatch(gameActions.toggleModal());
    joinResp({
      variables: {
        code,
        email,
      },
    })
      .then(() => {
        dispatch(categoryActions.setUser("user2"));
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div className="header-container">
      <div>
        <h1 className="quiz-title">QuizScript</h1>
      </div>
      <div>
        <button onClick={handleJoinGame}>Join</button>
      </div>
    </div>
  );
}

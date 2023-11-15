import { gql, useMutation } from "@apollo/client";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../../store/slices/category-slice";
import { gameActions } from "../../store/slices/game-slice";
import { useNavigate } from "react-router-dom";

const JOIN_GAME = gql`
  mutation ($code: Int!, $email: String!) {
    joinGame(code: $code, email: $email) {
      code
      category
      users
    }
  }
`;

const modal = forwardRef(function JoinGameModal(props, ref) {
  const dialog = useRef();
  const gameCode = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  const [joinResp] = useMutation(JOIN_GAME);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });

  function handleJoinGame() {
    joinResp({
      variables: {
        code: +gameCode.current.value,
        email,
      },
    })
      .then(() => {
        dispatch(gameActions.setGameCode(+gameCode.current.value));
        dispatch(categoryActions.setUser("user2"));
        navigate("/quiz");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <dialog ref={dialog} className="result-modal">
      <h2>Join Game</h2>
      <input type="text" ref={gameCode} />
      <button onClick={() => dialog.current.close()}>Close</button>
      <button onClick={handleJoinGame}>Join</button>
    </dialog>
  );
});

export default modal;

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { gameActions } from "../../store/slices/game-slice.js";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { categoryActions } from "../../store/slices/category-slice.js";
import StartGameCode from "./StartGameCode.jsx";

const START_GAME = gql`
  mutation ($email: String!, $category: String!, $code: Int!) {
    startGame(email: $email, category: $category, code: $code) {
      users
      code
      category
    }
  }
`;

const modal = forwardRef(function GameModal(props, ref) {
  const dialog = useRef();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const category = useSelector((state) => state.category.selectedCategory);
  const [code, setGameCode] = useState("");
  const [startResp] = useMutation(START_GAME);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
        const gameCode = generateGameCode();
        setGameCode(gameCode);
        handleStartGame(gameCode);
      },
    };
  });

  function generateGameCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  function handleStartGame(gameCode) {
    startResp({
      variables: {
        code: gameCode,
        email,
        category,
      },
    }).then(() => {
      dispatch(categoryActions.addCategory(category));
      dispatch(categoryActions.setUser("user1"));
      dispatch(gameActions.setGameCode(code));
    });
  }

  return (
    <dialog ref={dialog} className="result-modal">
      <h2>Start Game</h2>
      {code && <StartGameCode code={code} />}
      <form onSubmit={(e) => e.preventDefault()} dialog="dialog">
        <button onClick={() => dialog.current.close()}>Close</button>
        {/* <button onClick={handleStartGame}>Start</button> */}
      </form>
    </dialog>
  );
});

export default modal;

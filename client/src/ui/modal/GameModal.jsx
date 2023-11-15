import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { gameActions } from "../../store/slices/game-slice.js";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { categoryActions } from "../../store/slices/category-slice.js";

const START_GAME = gql`
  mutation ($email: String!, $category: String!, $code: Int!) {
    startGame(email: $email, category: $category, code: $code) {
      users
      code
      category
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

const GAME_PLAYERS = gql`
  query ($code: Int!) {
    getUsers(code: $code)
  }
`;

const modal = forwardRef(function GameModal(props, ref) {
  const dialog = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  const category = useSelector((state) => state.category.selectedCategory);
  const [code, setGameCode] = useState("");
  const [startResp] = useMutation(START_GAME);

  const { subscribeToMore } = useQuery(GAME_PLAYERS, {
    variables: { code },
  });

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
        setGameCode(generateGameCode());
      },
    };
  });

  const startSubscription = () => {
    console.log("the code here is:", code);
    subscribeToMore({
      document: GAME_SUBSCRIPTION,
      variables: { code },
      updateQuery: (prev, { subscriptionData }) => {
        console.log("this our my users", subscriptionData);
        if (!subscriptionData.data) return prev;
        const users = subscriptionData.data?.gameOn?.users;

        if (users.length === 2) {
          navigate("/quiz");
        }
      },
    });
  };

  useEffect(() => {
    startSubscription();
  }, [code]);

  function generateGameCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  function handleStartGame() {
    console.log("my api details are: ", code, email, category);

    startResp({
      variables: {
        code,
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
      <p>
        Game code: <strong>{code}</strong>
      </p>
      <form onSubmit={(e) => e.preventDefault()} dialog="dialog">
        <button onClick={() => dialog.current.close()}>Close</button>
        <button onClick={handleStartGame}>Start</button>
      </form>
    </dialog>
  );
});

export default modal;

import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoryActions } from "../../store/slices/category-slice";
import { gameActions } from "../../store/slices/game-slice";
import Modal from "../modal/Modal";

const JOIN_GAME = gql`
  mutation ($code: Int!, $email: String!) {
    joinGame(code: $code, email: $email) {
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

const GAME_SUBSCRIPTION = gql`
  subscription ($code: Int!) {
    gameOn(code: $code) {
      code
      category
      users
    }
  }
`;

const START_GAME = gql`
  mutation ($email: String!, $category: String!, $code: Int!) {
    startGame(email: $email, category: $category, code: $code) {
      users
      code
      category
    }
  }
`;

export default function StartGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");
  const [joinResp] = useMutation(JOIN_GAME);
  const email = useSelector((state) => state.auth.email);
  const code = useSelector((state) => state.game.code);
  const type = useSelector((state) => state.game.modalType);
  const open = useSelector((state) => state.game.open);
  const category = useSelector((state) => state.category.selectedCategory);

  const [startResp] = useMutation(START_GAME);

  const { subscribeToMore } = useQuery(GAME_PLAYERS, {
    variables: { code },
  });

  //   const subData = useSubscription(GAME_SUBSCRIPTION, {
  //     variables: { code },
  //   });

  //   console.log("the sub data is: ", subData);
  //   if (subData !== undefined && subData?.data?.gameOn?.users?.length === 2) {
  //     navigate("/quiz");
  //   }

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
  }, [code, gameCode]);

  function generateGameCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  function handleStartGame() {
    const code = generateGameCode();

    console.log("the code is: ", code);

    dispatch(gameActions.setGameCode(code));

    startResp({
      variables: {
        code,
        email,
        category,
      },
    }).then(() => {
      //   dispatch(categoryActions.addCategory(category));
      dispatch(categoryActions.setUser("user1"));
    });
  }

  function handleCloseModal() {
    dispatch(gameActions.toggleModal());
  }

  function handleJoinGame() {
    // startSubscription();

    joinResp({
      variables: {
        code: +gameCode,
        email,
      },
    })
      .then(() => {
        // dispatch(categoryActions.addCategory(category));
        dispatch(gameActions.setGameCode(+gameCode));
        dispatch(categoryActions.setUser("user2"));
        // navigate("/quiz");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startGame() {
    return (
      <>
        {" "}
        <h2>Game Code:</h2>
        <label>{code}</label>
        <button onClick={handleStartGame}>Let's play</button>
      </>
    );
  }

  function handleGameCode(num) {
    console.log("the num is: ", num);
    setGameCode(num);
    dispatch(gameActions.setGameCode(+num));
  }

  function joinGame() {
    return (
      <>
        {" "}
        <h2>Join Game:</h2>
        <input
          placeholder="game code"
          onChange={(e) => handleGameCode(e.target.value)}
          value={gameCode}
        />
        <button onClick={handleJoinGame}>Start</button>
      </>
    );
  }

  return (
    <Modal isOpen={open} onClose={handleCloseModal}>
      {type === "start" ? startGame() : joinGame()}
    </Modal>
  );
}

import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function StartGameCode({ code }) {
  const navigate = useNavigate();
  const { subscribeToMore } = useQuery(GAME_PLAYERS, {
    variables: { code },
  });

  const startSubscription = () => {
    subscribeToMore({
      document: GAME_SUBSCRIPTION,
      variables: { code },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const users = subscriptionData.data?.gameOn?.users;
        console.log("the users are: ", subscriptionData.data);
        if (users.length === 2) {
          navigate("/quiz");
        }
      },
    });
  };

  useEffect(() => {
    startSubscription();
  }, [code]);

  return (
    <p>
      Game code: <strong>{code}</strong>
    </p>
  );
}

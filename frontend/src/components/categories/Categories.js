import { gql, useQuery, useSubscription } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./categories.css";
import CategoryCard from "./CategoryCard";

const categories = gql`
  query {
    questions {
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

export default function Categories() {
  const nav = useNavigate();
  const { loading, error, data } = useQuery(categories);

  const subData = useSubscription(GAME_SUBSCRIPTION, {
    variables: { code: 1234 },
  });

  console.log("subdata is: ", subData);

  if (subData !== undefined && subData?.data?.gameOn?.users?.length === 2) {
    nav("/quiz");
  }

  if (loading) return "Loading..";
  if (error) return `${error.message}`;

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      <div className="all-categories">
        {data &&
          data.questions.map((question) => (
            <CategoryCard question={question} />
          ))}
      </div>
    </div>
  );
}

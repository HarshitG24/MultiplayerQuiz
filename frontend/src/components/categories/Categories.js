import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useSelector } from "react-redux";
import StartGame from "../game/StartGame";
import Header from "../header/Header";
import "./categories.css";
import CategoryCard from "./CategoryCard";

const categories = gql`
  query {
    questions {
      category
    }
  }
`;

export default function Categories() {
  const { loading, error, data } = useQuery(categories);
  const open = useSelector((state) => state.game.open);

  if (loading) return "Loading..";
  if (error) return `${error.message}`;

  return (
    <>
      <Header />
      <div className="categories-container">
        <h2>Categories</h2>
        <div className="all-categories">
          <CategoryCard categoryData={data} />
        </div>
        {/* {open && <StartGame />} */}
      </div>
    </>
  );
}

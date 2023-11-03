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

export default function Categories() {
  const { loading, error, data } = useQuery(categories);

  if (loading) return "Loading..";
  if (error) return `${error.message}`;

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      <div className="all-categories">
        {/* {data &&
          data.questions.map(({ category }) => (
            <CategoryCard category={category} />
          ))} */}
        <CategoryCard data={data} />
      </div>
    </div>
  );
}

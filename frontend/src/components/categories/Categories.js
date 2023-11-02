import { gql, useQuery } from "@apollo/client";
import React from "react";

const categories = gql`
  query {
    questions {
      category
    }
  }
`;

export default function Categories() {
  const { loading, error, data } = useQuery(categories);
  console.log("cat data is: ", data);

  if (loading) return "Loading..";
  if (error) return `${error.message}`;

  return (
    <div>
      <ul>{data && data.questions.map((q) => <li>{q.category}</li>)}</ul>
    </div>
  );
}

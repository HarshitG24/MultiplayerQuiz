import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useLocation } from "react-router-dom";

const FETCH_QUESTIONS = gql`
  query ($category: String!) {
    fetchQuestions(category: $category) {
      question
      ans
      options
    }
  }
`;

export default function Quiz() {
  const location = useLocation();
  const category = location.state?.category;
  const { data, loading, error } = useQuery(FETCH_QUESTIONS, {
    variables: { category },
  });

  if (loading) return "Loading..";
  if (error) return "Error";

  return (
    <div>
      <ul>{data && data.fetchQuestions.map((q) => <li>{q.question}</li>)}</ul>
    </div>
  );
}

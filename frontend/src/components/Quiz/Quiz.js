import { gql, useQuery } from "@apollo/client";
import React from "react";

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
  const { data, loading, error } = useQuery(FETCH_QUESTIONS, {
    variables: { category: "World Capital" },
  });

  if (loading) return "Loading..";
  if (error) return "Error";

  return <div>Quiz</div>;
}

import PageHeader from "../../ui/PageHeader/PageHeader";
import "./Category.css";
import CategoryCard from "./CategoryCard";
import { gql, useQuery } from "@apollo/client";

const categories = gql`
  query {
    questions {
      category
    }
  }
`;

export default function CategoriesComponent() {
  const { loading, error, data } = useQuery(categories);

  if (loading) return "Loading..";
  if (error) return `${error.message}`;

  return (
    <>
      <div className="categories-container">
        <PageHeader style={{ color: "var(--color-page-title)" }}>
          Categories
        </PageHeader>
        <div className="all-categories">
          <CategoryCard categoryData={data} />
        </div>
      </div>
    </>
  );
}

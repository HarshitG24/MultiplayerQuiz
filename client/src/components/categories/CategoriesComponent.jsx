import PageHeader from "../../ui/PageHeader/PageHeader";
import "./Category.css";
import CategoryCard from "./CategoryCard";
import { gql, useQuery } from "@apollo/client";

const CATEGORIES = gql`
  query {
    fetchCategories {
      category
      imageUrl
      description
    }
  }
`;

export default function CategoriesComponent() {
  const { loading, error, data } = useQuery(CATEGORIES);

  if (loading) return "Loading..";
  if (error) return `${error.message}`;

  return (
    <>
      <div className="categories-container">
        <PageHeader style={{ color: "var(--color-page-title)" }}>
          Categories
        </PageHeader>
        <div className="all-categories">
          <CategoryCard categoryData={data.fetchCategories} />
        </div>
      </div>
    </>
  );
}

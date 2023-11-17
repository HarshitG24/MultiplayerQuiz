import PageHeader from "../../ui/PageHeader/PageHeader";
import "./Category.css";
import { gql, useQuery } from "@apollo/client";
import CategoryCard from "./CategoryCard";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const CATEGORIES = gql`
  query {
    fetchCategories {
      category
      image_url
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
          <LazyLoadComponent>
            <CategoryCard categoryData={data.fetchCategories} />
          </LazyLoadComponent>
        </div>
      </div>
    </>
  );
}

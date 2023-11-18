import PageHeader from "../../ui/PageHeader/PageHeader";
import "./Category.css";
import { gql, useQuery } from "@apollo/client";
import { lazy, Suspense } from "react";
const LazyCardComponent = lazy(() => import("./CategoryCard"));

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
          <Suspense fallback={<div>Loading...</div>}>
            <LazyCardComponent categoryData={data.fetchCategories} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

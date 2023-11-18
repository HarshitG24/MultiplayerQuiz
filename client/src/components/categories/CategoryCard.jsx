import { useDispatch } from "react-redux";
import { categoryActions } from "../../store/slices/category-slice";
import PageHeader from "../../ui/PageHeader/PageHeader";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import GameModal from "../modal/GameModal";
import { useRef } from "react";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";

function CategoryCard({ categoryData, scrollPosition }) {
  const dispatch = useDispatch();
  const dialog = useRef();

  function handleStartGame(category) {
    dispatch(categoryActions.addCategory(category));
    dialog.current.open(category);
  }

  return (
    <>
      <GameModal ref={dialog} />
      {categoryData &&
        categoryData.map(({ category, image_url, description }) => (
          <div className="product" key={category}>
            <LazyLoadImage
              width="100%"
              height="100%"
              alt="this is category logo"
              effect="blur"
              src={image_url}
              scrollPosition={scrollPosition}
            />
            <div className="category-details">
              <PageHeader style={{ color: "var(--color-header-title)" }}>
                {category}
              </PageHeader>
              <p>{description}</p>
            </div>
            <div className="start-game">
              <PrimaryButton onClick={handleStartGame.bind(this, category)}>
                Start
              </PrimaryButton>
            </div>
          </div>
        ))}
    </>
  );
}

export default trackWindowScroll(CategoryCard);

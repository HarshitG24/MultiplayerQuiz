import { useDispatch } from "react-redux";
import { categoryActions } from "../../store/slices/category-slice";
import PageHeader from "../../ui/PageHeader/PageHeader";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import gown from "../../assets/dream-gown.jpg";
import GameModal from "../modal/GameModal";
import { useRef } from "react";

export default function CategoryCard({ categoryData }) {
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
        categoryData.map(({ category, imageUrl, description }) => (
          <div className="product" key={category}>
            <img
              // src={gown}
              src={imageUrl}
              alt="This is the topic illustration"
              className="category-image"
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

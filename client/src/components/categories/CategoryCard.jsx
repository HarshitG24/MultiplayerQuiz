import { useDispatch } from "react-redux";
import { gameActions } from "../../store/slices/game-slice";
import { categoryActions } from "../../store/slices/category-slice";
import PageHeader from "../../ui/PageHeader/PageHeader";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import gown from "../../assets/dream-gown.jpg";
import GameModal from "../../ui/modal/GameModal";
import { useRef } from "react";

export default function CategoryCard({ categoryData }) {
  const dispatch = useDispatch();
  const dialog = useRef();

  function handleStartGame(category) {
    // dispatch(gameActions.setModalType("start"));
    // dispatch(gameActions.toggleModal());

    dispatch(categoryActions.addCategory(category));
    dialog.current.open();
  }

  return (
    <>
      <GameModal ref={dialog} />
      {categoryData &&
        categoryData.questions.map(({ category }) => (
          <div className="product" key={category}>
            <img
              src={gown}
              alt="This is the topic illustration"
              className="category-image"
            />
            <div className="category-details">
              <PageHeader>{category}</PageHeader>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                debitis esse voluptatem commodi modi reprehenderit vitae iusto
                harum! Nulla, fugit repudiandae! Numquam nihil voluptas
                perspiciatis ex praesentium, qui nobis corrupti?
              </p>
            </div>
            <div className="start-game">
              <PrimaryButton onClick={handleStartGame.bind(this, category)}>
                {/* handleStartGame.bind(this, category) */}
                Start
              </PrimaryButton>
            </div>
          </div>
        ))}
    </>
  );
}

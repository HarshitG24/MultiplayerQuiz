import { useDispatch } from "react-redux";
import { categoryActions } from "../../store/slices/category-slice";
import PageHeader from "../../ui/PageHeader/PageHeader";
import PrimaryButton from "../../ui/PrimaryButton/PrimaryButton";
import GameModal from "../modal/GameModal";
import { useRef } from "react";
// import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function CategoryCard({ categoryData }) {
  const dispatch = useDispatch();
  const dialog = useRef();

  function handleStartGame(category) {
    dispatch(categoryActions.addCategory(category));
    dialog.current.open(category);
  }

  // const LazyLoadedImage = ({ src }) => {
  //   const [ref, inView] = useInView({
  //     triggerOnce: true,
  //   });

  //   return (
  //     <img ref={ref} src={inView ? src : ""} alt="this is category banner" />
  //   );
  // };

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
            />
            {/* <img
              src={image_url}
              alt="This is the topic illustration"
              className="category-image"
            /> */}
            {/* <LazyLoadedImage src={image_url} /> */}
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

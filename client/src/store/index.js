import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/auth-slice";
import gameSlice from "./slices/game-slice";
import quizSlice from "./slices/quiz-slice";
import categorySlice from "./slices/category-slice";

const store = configureStore({
  reducer: {
    category: categorySlice,
    auth: authSlice,
    quiz: quizSlice,
    game: gameSlice,
  },
});

export default store;

import authSlice from "./slices/auth-slice";
import quizSlice from "./slices/quiz-slice";

const { configureStore } = require("@reduxjs/toolkit");
const { default: categorySlice } = require("./slices/category-slice");

const store = configureStore({
  reducer: { category: categorySlice, auth: authSlice, quiz: quizSlice },
});

export default store;

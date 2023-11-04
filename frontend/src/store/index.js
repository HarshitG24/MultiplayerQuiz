import authSlice from "./slices/auth-slice";

const { configureStore } = require("@reduxjs/toolkit");
const { default: categorySlice } = require("./slices/category-slice");

const store = configureStore({
  reducer: { category: categorySlice, auth: authSlice },
});

export default store;

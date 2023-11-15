import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: { selectedCategory: "", user: "" },
  reducers: {
    addCategory(state, action) {
      console.log("the payload is: ", action.payload);
      state.selectedCategory = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;

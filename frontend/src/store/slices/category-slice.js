const { createSlice } = require("@reduxjs/toolkit");

const categorySlice = createSlice({
  name: "category",
  initialState: { selectedCategory: "", user: "" },
  reducers: {
    addCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;

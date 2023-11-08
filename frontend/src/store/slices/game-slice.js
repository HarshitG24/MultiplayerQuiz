import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: { code: "", open: false, modalType: "" },
  reducers: {
    setGameCode(state, action) {
      state.code = action.payload;
    },
    toggleModal(state) {
      state.open = !state.open;
    },
    setModalType(state, action) {
      state.modalType = action.payload;
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;

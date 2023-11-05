import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questions: [],
    currentQuestion: "",
    currentAnswer: "",
    opponentAnswer: "",
    index: 0,
  },
  reducers: {
    setAllQuestions(state, action) {
      state.questions = action.payload;
    },
    setQuestion(state, action) {
      state.currentQuestion = action.payload;
    },
    setAnswer(state, action) {
      state.currentAnswer = action.payload;
    },
    setOpponentAnswer(state, action) {
      state.opponentAnswer = action.payload;
    },
    setCurrentIndex(state, action) {
      state.index = action.payload;
    },
  },
});

export const quizActions = quizSlice.actions;
export default quizSlice.reducer;

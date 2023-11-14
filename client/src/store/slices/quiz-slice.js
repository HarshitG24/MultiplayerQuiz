import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questions: [],
    currentQuestion: "",
    correctAns: "",
    currentAnswer: "",
    opponentAnswer: "",
    currentScore: 0,
    opponentScore: 0,
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
    setCurrentScore(state, action) {
      state.currentScore = action.payload;
    },
    setOpponentScore(state, action) {
      state.opponentScore = action.payload;
    },
    setCorrectAns(state, action) {
      state.correctAns = action.payload;
    },
  },
});

export const quizActions = quizSlice.actions;
export default quizSlice.reducer;

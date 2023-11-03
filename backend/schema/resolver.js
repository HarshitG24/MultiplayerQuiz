import dbConnector from "../database/dbConnector.js";

const resolvers = {
  Query: {
    async users(_, args) {
      const userData = await dbConnector.allUsers();
      return userData;
    },

    async questions(_, args) {
      const resp = await dbConnector.getQuestions();
      const questions = resp.questionBank;

      return questions;
    },
    async fetchQuestions(_, { category }) {
      const ans = await dbConnector.questionByCategory({ category });
      return ans;
    },
  },
  Mutation: {
    async signup(_, args) {
      const data = await dbConnector.signUp(args);
      const newUser = { email: data.email, password: "" };
      return newUser;
    },
    async login(_, args) {
      const userData = await dbConnector.login(args);
      return userData;
    },
    async startGame(_, args) {
      const response = await dbConnector.startGame(args);
      return {
        email: response.email,
        password: "",
      };
    },
  },
};

export default resolvers;

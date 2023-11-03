import dbConnector from "../database/dbConnector.js";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();
const CODE = "1234";

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
      const { category, users, code } = await dbConnector.startGame(args);
      startGameSubScription({ category, users, code });
      return {
        category: category,
        users: users,
        code: code,
      };
    },

    async joinGame(_, args) {
      const response = await dbConnector.joinGame(args);
      startGameSubScription(response);
      return response;
    },
  },

  Subscription: {
    gameOn: {
      subscribe: (_, { code }) => pubSub.asyncIterator(code.toString()),
    },
  },
};

const startGameSubScription = ({ users, code, category }) => {
  console.log("the sub here: ", users, code, category);
  pubSub.publish(code.toString(), {
    gameOn: { users, code, category },
  });
};

export default resolvers;

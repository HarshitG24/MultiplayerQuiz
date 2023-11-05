import dbConnector from "../database/dbConnector.js";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();
const CODE = "5678";

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

    async fetchQuizData(_, args) {
      const resp = await dbConnector.getQuizData(args);
      return {
        category: resp?.category || "",
        questions: resp?.questions || [],
      };
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

    async addAnswer(_, args) {
      const response = await dbConnector.updateAnswer(args);
      return response;
    },

    // async addQuestions(_, args) {
    //   const resp = await dbConnector.questionByCategory(args);
    //   return resp;
    // },
  },

  Subscription: {
    gameOn: {
      subscribe: (_, { code }) => pubSub.asyncIterator(code.toString()),
    },
  },
};

const startGameSubScription = ({ users, code, category }) => {
  pubSub.publish(code.toString(), {
    gameOn: { users, code, category },
  });
};

export default resolvers;

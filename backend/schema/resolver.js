import dbConnector from "../database/dbConnector.js";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

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

    async getUsers(_, { code }) {
      const resp = await dbConnector.getUsers(code);
      console.log("resp is: ", resp);
      return resp.users;
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
      const { code, user } = args;

      const response = await dbConnector.updateAnswer(args);
      const { user1Score, user2Score, user1Ans, user2Ans } = response;
      answerSubScription({
        user1Score,
        user2Score,
        user1Ans,
        user2Ans,
        code,
        user,
      });
      return response;
    },

    // async addQuestions(_, args) {
    //   const resp = await dbConnector.questionByCategory(args);
    //   return resp;
    // },
  },

  Subscription: {
    gameOn: {
      subscribe: (_, { code }) => pubSub.asyncIterator("GAME_ON"),
    },
    optionSelected: {
      subscribe: (_, { code, user }) => pubSub.asyncIterator(`${code}`),
    },
  },
};

const startGameSubScription = ({ users, code, category }) => {
  pubSub.publish("GAME_ON", {
    gameOn: { users, code, category },
  });
};
const answerSubScription = ({
  user1Score,
  user2Score,
  user1Ans,
  user2Ans,
  code,
  user,
}) => {
  pubSub.publish(`${code}`, {
    optionSelected: { user1Score, user2Score, user1Ans, user2Ans },
  });
};

export default resolvers;

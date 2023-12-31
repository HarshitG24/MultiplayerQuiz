import dbConnector from "../database/dbConnector.js";
import { PubSub } from "graphql-subscriptions";
import { authenticateGoogle } from "../auth/auth.js";
import "../auth/auth.js";
import { hasMinLength, isEmail, passwordEqual } from "../util/validation.js";
import { createJSONToken, validateJWTToken } from "../auth/token.js";

const pubSub = new PubSub();

const resolvers = {
  Query: {
    async users(_, args) {
      const userData = await dbConnector.allUsers();
      return userData;
    },

    async fetchCategories(_, args) {
      const categoryData = await dbConnector.getCategories();
      return categoryData;
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
      const { email, password, confirmPassword } = args;
      if (
        !isEmail(email) ||
        !hasMinLength(password, 6) ||
        !passwordEqual(password, confirmPassword)
      ) {
        return {
          statusCode: 400,
          message: "Authentication Failed",
        };
      }
      return await dbConnector.signUp(args);
    },
    async login(_, args) {
      const { email, password } = args;

      if (!isEmail(email) || !hasMinLength(password, 6)) {
        return {
          statusCode: 400,
          message: "Authentication Failed",
        };
      }

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
    signUpGoogle: async (_, { accessToken }, ctx) => {
      const { req, res } = ctx;
      // const { User } = models;

      req.body = {
        ...req.body,
        // eslint-disable-next-line
        access_token: accessToken,
      };

      try {
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateGoogle(req, res);
        // Optional we can also use getGoogleProfile to reterieve user informations
        // const data = await getGoogleProfile(accessToken);

        if (info) {
          switch (info.code) {
            case "ETIMEDOUT":
              throw new Error("Failed to reach Google: Try Again");
            default:
              throw new Error("something went wrong");
          }
        }
        // If not Error take user information
        const { _json } = data;
        // Deconstruct user information from _json data
        const { email } = _json;
        const firstName = _json.given_name;
        const lastName = _json.family_name;

        let accessToken = "";
        let refreshToken = "";
        let message = "";

        // Check if user is registered
        // const userExist = await User.findOne({
        //   where: {
        //     email: email.toLowerCase().replace(/ /gi, ""),
        //   },
        // });

        // if (!userExist) {
        //   const newUser = await User.create({
        //     email: email.toLowerCase().replace(/ /gi, ""),
        //     firstName,
        //     lastName,
        //   });
        //   // generate Token
        //   // create a function that will generate token a sign it for you.
        //   //accessToken = await generateToken(newUser.dataValues.id);
        //   //refreshToken = await generateToken(newUser.dataValues.id, true);

        return {
          email,
          accessToken: createJSONToken(email),
          refreshToken: `Bearer ${refreshToken}`,
        };
        // }
        // generate Token
        //accessToken = await generateToken(userExist.dataValues.id);
        //refreshToken = await generateToken(userExist.dataValues.id, true);
      } catch (error) {
        return error;
      }
    },

    verifyJWT: (_, { token }) => {
      const resp = validateJWTToken(token);

      if (resp === undefined) {
        return {
          statusCode: 400,
          message: "Expired",
        };
      }

      return {
        statusCode: 200,
        message: "success",
      };
    },
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

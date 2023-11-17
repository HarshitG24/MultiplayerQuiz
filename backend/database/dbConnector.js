import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@graphql.udbq46t.mongodb.net/test`;
const client = new MongoClient(MONGO_URL, {});

const db = client.db("GraphQL");
const users = db.collection("users");
const categories = db.collection("categories");
const gameRoom = db.collection("room");

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

function dbConnector() {
  let dbObj = {};

  dbObj.signUp = async ({ email, password }) => {
    await client.connect();

    const user = await users.find({ email }).toArray();
    if (user.length > 0) {
      return {
        statusCode: 401,
        message: "User already exists with the given email",
      };
    }

    try {
      const hashedPassword = await hashPassword(password);
      await users.insertOne({ email, password: hashedPassword });
      return {
        statusCode: 200,
        message: "Success",
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Something went wrong!",
      };
    }
  };

  dbObj.allUsers = async () => {
    await client.connect();

    try {
      const usersList = await users.find().toArray();
      return usersList || [];
    } catch (error) {
      throw error;
    }
  };

  dbObj.user = async (email) => {
    await client.connect();

    try {
      const usersList = await users.find({ email }).toArray();
      return usersList.length > 0 ? usersList[0] : "";
    } catch (error) {
      throw error;
    }
  };

  dbObj.login = async (data = { email: "", password: "" }) => {
    await client.connect();

    const { email, password } = data;

    try {
      const usersList = await users.find({ email }).toArray();
      if (usersList.length > 0) {
        const user = usersList[0];

        const result = await comparePassword(password, user.password);
        if (result) {
          return { statusCode: 200, message: "success" };
        } else {
          return {
            statusCode: 401,
            message: "Invalid credentials",
          };
        }
      } else {
        return {
          statusCode: 401,
          message: "No user found for the given email.",
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error,
      };
    }
  };

  dbObj.addQuestions = async (data) => {
    await client.connect();
    try {
      await categories.insertOne(data);
      return 200;
    } catch (error) {
      console.log(error);
      return 400;
    } finally {
      // client.close();
    }
  };

  dbObj.getQuestions = async () => {
    await client.connect();

    try {
      const resp = await categories.find().toArray();

      return {
        questionBank: resp.length > 0 ? resp : [],
        statusCode: 200,
      };
    } catch (error) {
      return {
        questionBank: [],
        statusCode: 400,
      };
    }
  };
  dbObj.getCategories = async () => {
    await client.connect();

    try {
      const resp = await categories
        .find(
          {},
          { projection: { category: 1, image_url: 1, description: 1, _id: 0 } }
        )
        .toArray();

      console.log(resp);

      return resp;
    } catch (error) {
      return [];
    }
  };

  dbObj.getQuizData = async ({ code }) => {
    await client.connect();

    try {
      const res = await gameRoom.find({ code }).toArray();

      if (res !== undefined && res.length > 0) {
        const { category, questions } = res[0];

        return {
          category,
          questions,
          message: "Success",
          statusCode: 200,
        };
      }
    } catch (error) {
      return { category: "", questions: [], message: error, statusCode: 400 };
    }
  };

  // dbObj.questionByCategory = async (data = { category: "", code: "" }) => {
  //   await client.connect();
  //   const { category, code } = data;
  //   try {
  //     const questions = await categories
  //       .aggregate([
  //         { $match: { category } },
  //         { $unwind: { path: "$questions" } },
  //         { $sample: { size: 5 } },
  //         {
  //           $replaceRoot: {
  //             newRoot: "$questions",
  //           },
  //         },
  //       ])
  //       .toArray();

  //     await gameRoom.findOneAndUpdate({ code }, { $set: { questions } });

  //     return {
  //       statusCode: 200,
  //       message: "Success",
  //     };
  //   } catch (error) {
  //     console.log(error);

  //     return {
  //       statusCode: 400,
  //       message: error,
  //     };
  //   }
  // };

  dbObj.startGame = async (data = { email: "", category: "", code: "" }) => {
    await client.connect();
    const { email, category, code } = data;
    try {
      const questions = await categories
        .aggregate([
          { $match: { category } },
          { $unwind: { path: "$questions" } },
          { $sample: { size: 5 } },
          {
            $replaceRoot: {
              newRoot: "$questions",
            },
          },
        ])
        .toArray();

      await gameRoom.insertOne({
        category: category,
        users: [email],
        code: code,
        user1Score: 0,
        user2Score: 0,
        user1Ans: [],
        user2Ans: [],
        questions,
      });

      let obj = {
        category: category,
        users: [email],
        code: code,
        status: 200,
      };

      return obj;
    } catch (error) {
      console.error(error);
      return {
        category: "",
        users: "",
        code: "",
        status: 400,
      };
    }
  };

  dbObj.joinGame = async (data = { code: "", email: "" }) => {
    await client.connect();
    const { code, email } = data;
    try {
      const resp = await gameRoom.findOneAndUpdate(
        { code },
        { $addToSet: { users: email } },
        { returnDocument: "after" }
      );

      return {
        code: resp.code,
        users: resp.users,
        category: resp.category,
      };
    } catch (error) {
      console.log("error is: ", error);

      return {
        code: "",
        users: "",
        category: "",
      };
    }
  };

  dbObj.updateAnswer = async (
    data = { code: "", user: "", answer: "", score: "", question: "" }
  ) => {
    await client.connect();
    const { code, user, answer, score, question } = data;
    try {
      const resp = await gameRoom.findOneAndUpdate(
        { code },
        {
          $push: {
            [`${user}Ans`]: { question, answer },
          },
          $set: {
            [`${user}Score`]: score,
          },
        },
        { returnDocument: "after" }
      );
      const { user1Score, user2Score, user1Ans, user2Ans } = resp;
      return {
        // statusCode: 200,
        // message: "Success",
        user1Score,
        user2Score,
        user1Ans,
        user2Ans,
      };
    } catch (error) {
      return {
        // statusCode: 400,
        // message: error.message,
        user1Score: "",
        user2Score: "",
        user1Ans: "",
        user2Ans: "",
      };
    }
  };

  dbObj.getUsers = async (code = "") => {
    await client.connect();
    try {
      const res = await gameRoom.find({ code }).toArray();
      return {
        users: res.length > 0 ? res[0].users : [],
      };
    } catch (error) {
      return {
        users: [],
      };
    }
  };

  return dbObj;
}

export default dbConnector();

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

    try {
      const hashedPassword = await hashPassword(password);
      await users.insertOne({ email, password: hashedPassword });
      return { email, status: 200 };
    } catch (error) {
      console.error("error: " + error);
      return 400;
    } finally {
      //   client.close();
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
        }
      }

      return {
        statusCode: 400,
        message: "something went wrong",
      };
    } catch (error) {
      return {
        statusCode: 400,
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
      await gameRoom.findOneAndUpdate(
        { code },
        {
          $set: {
            [`${user}Ans`]: [{ question, answer }],
            [`${user}Score`]: score,
          },
        }
      );

      return {
        statusCode: 200,
        message: "Success",
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }
  };

  return dbObj;
}

export default dbConnector();

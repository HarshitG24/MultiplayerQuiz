import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@graphql.udbq46t.mongodb.net/test`;
const client = new MongoClient(MONGO_URL, {});

const db = client.db("GraphQL");
const users = db.collection("users");

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

  return dbObj;
}

export default dbConnector();

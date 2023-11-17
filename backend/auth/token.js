import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createJSONToken(email) {
  return jwt.sign({ email }, process.env.TOKEN_KEY, { expiresIn: "1h" });
}

export function validateJWTToken(token) {
  try {
    const ans = jwt.verify(token, process.env.TOKEN_KEY);
    return ans;
  } catch (error) {
    console.log(error);
  }
}

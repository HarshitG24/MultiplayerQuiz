import express from "express";
import db from "../database/dbConnector.js";
const router = express.Router();

router.post("/categories", async (req, res) => {
  const resp = await db.addQuestions(req?.body || {});
  res.send({ resp: "something", status: resp });
});

export default router;

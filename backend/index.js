import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import openai from "./utils/openai.js";

const app = express();
const PORT = 8000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.status(200).send("health ok");
});

// openai

app.post("/ask-ai", async (req, res) => {
  const { messages } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    console.log(completion);

    res.status(200).json({ message: completion.choices[0]?.message?.content });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Internal server error " });
  }
});

app.listen(PORT, () => {
  console.log(`serve on port ${PORT}`);
});

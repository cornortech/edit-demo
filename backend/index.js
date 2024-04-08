import express from "express";
import dotenv from "dotenv";
dotenv.config();


import openai from "./utils/openai.js";

const app = express();
const PORT = 8000;
app.use(express.json());

// openai
app.get("/ask-ai", async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a master proofreader. Only proofread the given text, don't add new text to the document. The instructions are often in English, but keep the proofread text in the same language as the language being asked to proofread.",
        },
        {
          role: "user",
          content: `Proofread this but only fix grammar: ${prompt}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    console.log(completion);

    res.status(200).json({ message: completion.choices[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Internan server error " });
  }
});

app.listen(PORT, () => {
  console.log(`serve on port ${PORT}`);
});

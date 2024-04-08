import openai from "openai"
import dotenv from "dotenv";
dotenv.config();

const openAi = new openai({
  apiKey: process.env.OPEN_AI_API,
});
export default openAi;
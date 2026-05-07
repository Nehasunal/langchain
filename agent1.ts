
//import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

// let llm = new ChatOpenAI({
//     modelName: "gpt-4o-mini",
// });

let llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash", // must be defined
    apiKey: process.env.GOOGLE_API_KEY, // explicitly pass
});
let response  = await llm.invoke(
     "What is the capital of France?"
)
console.log(response)

/** Get prompt : https://smith.langchain.com/hub/rlm/rag-prompt?organizationId=eef38ff9-02a0-4ffb-b119-2cdacfd1fbfe */
import { StringOutputParser } from "@langchain/core/output_parsers";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { retriever } from "./retriever";
import dotenv from "dotenv";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "../utils/formatDocument";
import { chat } from "../utils/chat";

dotenv.config();
const prompt = ChatPromptTemplate.fromMessages([
  [
    "human",
    `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question} 
Context: {context} 
Answer:`
  ]
]);

let llm = await new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash", // must be defined
      apiKey: process.env.GOOGLE_API_KEY, // explicitly pass
    });
const outputParser = await new StringOutputParser()
const retrieveData = await retriever();
const llmChain = RunnableSequence.from([
  (input) => input.question, // extract question from input
  retrieveData,
  formatDocumentsAsString, // format retrieved documents as string
]);

const generationChain = RunnableSequence.from([
  {
    question: (input) => input.question, // extract question from input
    context: llmChain, // get context from retrieval chain
  },
  prompt,
  llm,
  outputParser
]);

const chatHandler = async function(question: string) {
  return {
    answer: generationChain.stream({question})
  }
}

chat(chatHandler)
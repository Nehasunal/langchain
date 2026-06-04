/** Get prompt : https://smith.langchain.com/hub/rlm/rag-prompt?organizationId=eef38ff9-02a0-4ffb-b119-2cdacfd1fbfe */
import { StringOutputParser } from "@langchain/core/output_parsers";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { retriever } from "./retriever";
import dotenv from "dotenv";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "../utils/formatDocument";
import { chat, ChatHandler } from "../utils/chat";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

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

const qcSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

const qcPrompt = ChatPromptTemplate.fromMessages([
  ["system", qcSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const qcChain = RunnableSequence.from([qcPrompt, llm, outputParser]);

const chatHistory: BaseMessage[] = [];//in real prod, save it in db 


const chatHandler: ChatHandler = async (question: string) => {
  let contextualizedQuestion = null;

  if (chatHistory.length > 0) {
    contextualizedQuestion = await qcChain.invoke({
      question,
      chat_history: chatHistory,
    });
    console.log(`Contextualized Question: ${contextualizedQuestion}`);
  }

  return {
    answer: generationChain.stream({
      question: contextualizedQuestion || question,
      chat_history: chatHistory,
    }),
    answerCallBack: async (answerText: string) => {
      chatHistory.push(new HumanMessage(contextualizedQuestion || question));
      chatHistory.push(new AIMessage(answerText));
    },
  };
};


chat(chatHandler)
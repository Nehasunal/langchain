import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LLM } from "@langchain/core/language_models/llms";
import { LLMChain } from "@langchain/classic/chains";

dotenv.config();

const personalisedPrompt = async function(
  topic: string, level: string
){

    const prompt = await new PromptTemplate({
      inputVariables: ["topic", "level"],
      template: "Explain {topic} in 10 words for a {level} person"
    });

    let llm = await new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash", // must be defined
      apiKey: process.env.GOOGLE_API_KEY, // explicitly pass
    });

    const data = await new StringOutputParser()
    
    //Option1: Leagacy chain
    const llmChain = new LLMChain({
      prompt,
      llm,
      outputParser: data
    })
    
    const invokeLLM = await llmChain.invoke({topic, level});
    return invokeLLM;
}

const data = await personalisedPrompt("quantum computing", "beginner");
console.log(data);
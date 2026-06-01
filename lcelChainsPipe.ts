import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

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
    
    //Option1: LCEL chain - using pipe operator
    // If we have to create multiple chains it will become complex and not readable
    
    
    // ** const llmChain = prompt.pipe(llm).pipe(data); **//

    //Option 2: LCEL chain - using runnable sequence
    const llmChain = RunnableSequence.from([prompt, llm, data]);
    
    const invokeLLM = await llmChain.invoke({topic, level});
    return invokeLLM;
}

const data = await personalisedPrompt("aws", "beginner");
console.log(data);
import dotenv from "dotenv";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";

dotenv.config();

export async function retriever(): Promise<VectorStoreRetriever> {

  const embeddingLLM = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY,
  });

  console.log(`Initialized Google Generative AI Embeddings.`);

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX_NAME!;
  const pineconeIndex = pinecone.index(indexName);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddingLLM, {
    pineconeIndex});
  console.log(`Initialized Pinecone index: ${indexName}.`);

  const retriever = vectorStore.asRetriever();
  return retriever;
}

// const retrieverInstance = await retriever();
// const context = await retrieverInstance.invoke("What is LangChain?");
// console.log(context);
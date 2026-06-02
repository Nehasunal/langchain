import dotenv from "dotenv";
import { loadDocument } from "./loadDocument";
import { splitDocumnets } from "./splitDocuments";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

async function main() {
  const documents = await loadDocument();
  console.log(`Loaded ${documents.length} documents.`);

  const splitDocuments = await splitDocumnets(documents);
  console.log(`Split into ${splitDocuments.length} documents.`);

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

  console.log(`Initialized Pinecone index: ${indexName}.`);

  // PROCESS IN BATCHES
  for (let i = 0; i < splitDocuments.length; i += 100) {
    const batch = splitDocuments.slice(i, i + 100);

    if (!batch.length) continue;

    console.log(`Processing batch ${i / 100 + 1} (${batch.length} docs)`);

    const texts = batch.map((doc) => doc.pageContent);

    // 1. Generate embeddings manually (IMPORTANT FIX)
    const embeddings = await embeddingLLM.embedDocuments(texts);

    // 2. Safety check
    if (!embeddings.length) {
      throw new Error(`Embedding failed for batch ${i / 100 + 1}`);
    }

    // 3. Convert to Pinecone format
    const vectors = embeddings.map((values, idx) => ({
      id: `${i + idx}`,
      values,
      metadata: {
        text: batch[idx].pageContent,
      },
    }));

    // 4. Upsert to Pinecone
    await pineconeIndex.upsert({
  records: vectors,
});
  }

  console.log(`All documents processed and stored in Pinecone.`);
}

main().catch((err) => {
  console.error("Error:", err);
});
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { loadDocument } from "./loadDocument";


export async function splitDocumnets(documents: Document[]): Promise<Document[]>{
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocuments = await splitter.splitDocuments(documents);
  return splitDocuments;

}

// const documents = await loadDocument();
// const splitDocuments = await splitDocumnets(documents);
// console.log(splitDocuments);
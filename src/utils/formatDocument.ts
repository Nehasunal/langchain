import { Document } from "@langchain/core/documents";

export function formatDocumentsAsString(
  documents: Document[]
): string {
  return documents
    .map((doc) => doc.pageContent)
    .join("\n\n");
}
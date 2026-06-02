import { Document } from "@langchain/core/documents";
import { crawlLangchainDocsUrls } from "./crawlDocument";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

export async function loadDocument(): Promise<Document[]> {
  try {
    const langChainDocs = await crawlLangchainDocsUrls();

    const rawDocuments: Document[] = [];
    for (const docUrl of langChainDocs) {
      const loader = new CheerioWebBaseLoader(docUrl);
      const docs = await loader.load();
      rawDocuments.push(...docs);
    }
    return rawDocuments;
  } catch (error) {
    console.error(`Error loading document : ${error}`);
    return [];
  }
}

// const rawDocuments =  await loadDocument(); //comment when using splitDocuments.ts, otherwise it will load the document twice
// console.log(rawDocuments);
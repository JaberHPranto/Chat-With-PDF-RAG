import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function getChunkedDocsFromPDF() {
  try {
    const loader = new PDFLoader("E:/Web Apps/chat-with-pdf/docs/cv.pdf");
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
    return chunkedDocs;
  } catch (error) {
    console.log("err", error);
    throw new Error("PDF docs chunking failed");
  }
}

import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export async function embedAndStoreDocs(
  pineconeClient: Pinecone,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  try {
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      model: "text-embedding-ada-002",
    });
    const index = pineconeClient.Index("gen-ai");

    // embed the pdf
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
  } catch (error) {
    console.log("err", error);
    throw new Error("Failed to load your docs !!!");
  }
}

export async function getVectorStore(pineconeClient: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      model: "text-embedding-ada-002",
    });
    const index = pineconeClient.Index("gen-ai");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text", // metadata key used during retrieving the information from pinecone
    });

    return vectorStore;
  } catch (error) {
    console.log("error", error);
    throw new Error("Something went wrong while getting the vector store !!!");
  }
}

import { Pinecone } from "@pinecone-database/pinecone";
import { delay } from "./utils";

// Already created by Pinecone Console
async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: "gen-ai",
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log(
      `Waiting for ${process.env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete... `
    );

    await delay(parseInt(process.env.INDEX_INIT_TIMEOUT as string));
    console.log("Index created !!");
  } catch (error) {
    console.log("error", error);
    throw new Error("Index creation failed");
  }
}

let pineconeClient: Pinecone | null = null;

async function initPineconeClient() {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  // const isIndexExist = (await pc.listIndexes()).indexes?.some((index) => index.name === 'gen-ai')
  return pc;
}

export async function getPineconeClient() {
  if (!pineconeClient) {
    pineconeClient = await initPineconeClient();
  }

  return pineconeClient;
}

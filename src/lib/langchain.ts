import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter, StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { stremingModel } from "./llm";
import { getPineconeClient } from "./pinecone-client";
import { QA_TEMPLATE } from "./prompt-template";
import { getVectorStore } from "./vector-store";

type CallChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: CallChainArgs) {
  try {
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);

    const retriever = vectorStore.asRetriever();

    // const prompt = PromptTemplate.fromTemplate(QA_TEMPLATE);
    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", QA_TEMPLATE],
    //   new MessagesPlaceholder("question"),
    //   ["human", "{question}"],
    // ]);

    const customRagPrompt = PromptTemplate.fromTemplate(QA_TEMPLATE);
    const ragChain = await createStuffDocumentsChain({
      llm: stremingModel,
      prompt: customRagPrompt,
      outputParser: new StringOutputParser(),
    });

    const context = await retriever.invoke(sanitizedQuestion);

    const results = await ragChain.stream({
      question: sanitizedQuestion,
      context,
    });

    const aiStream = LangChainAdapter.toAIStream(results);
    return new StreamingTextResponse(aiStream);
  } catch (error) {
    console.log("⚠️⚠️⚠️ err from call chain", error);
    throw new Error("Call chain method failed to execute successfully");
  }
}

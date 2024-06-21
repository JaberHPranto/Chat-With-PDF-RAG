import { ChatOpenAI } from "@langchain/openai";

export const stremingModel = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  streaming: true,
  verbose: true,
  temperature: 0,
});

export const nonStremingModel = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  verbose: true,
  temperature: 0,
});

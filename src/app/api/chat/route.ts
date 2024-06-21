import { NextRequest, NextResponse } from "next/server";
import { callChain } from "@/lib/langchain";
import { Message } from "ai";

const formatMessage = (message: Message) => {
  return `${message.role === "user" ? "Human" : "Assistant"} : ${
    message.content
  }`;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: Message[] = body.messages ?? [];
  console.log("🚀 ~ messages:", messages);
  const formattedPreviousMessage = messages.slice(0, -1).map(formatMessage);
  const question = messages[messages.length - 1].content;

  if (!question) {
    return NextResponse.json("Error: No question in the message", {
      status: 400,
    });
  }

  try {
    const stremingTextResponse = await callChain({
      question,
      chatHistory: formattedPreviousMessage.join("\n"),
    });

    return stremingTextResponse;
  } catch (error) {
    console.log("err", error);
    return NextResponse.json("Error: Something went wrong !!!", {
      status: 500,
    });
  }
}

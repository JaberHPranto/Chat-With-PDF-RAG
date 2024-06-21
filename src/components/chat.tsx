"use client";

import { Message, useChat } from "ai/react";
import ChatBubble from "./chat-bubble";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { initialMessages, scrollToBottom } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useEffect, useRef } from "react";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
    });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages]);

  return (
    <div className="rounded-2xl border h-[75vh] flex flex-col justify-between">
      <div className="p-6 overflow-auto" ref={containerRef}>
        {messages.map(({ id, content, role }: Message, index) => (
          <ChatBubble
            key={id}
            content={content}
            role={role}
            sources={role != "assistant" ? [] : []}
          />
        ))}
      </div>

      <form className="p-4 flex clear-both" onSubmit={handleSubmit}>
        <Input
          placeholder="Type to chat with AI"
          className="mr-2"
          value={input}
          onChange={handleInputChange}
        />

        <Button>{isLoading ? <Spinner /> : "Ask"}</Button>
      </form>
    </div>
  );
};

export default Chat;

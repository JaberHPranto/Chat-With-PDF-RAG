import React from "react";
import Balancer from "react-wrap-balancer";
import ReactMarkdown from "react-markdown";
import { Message } from "ai/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formattedText } from "@/lib/utils";

interface Props extends Partial<Message> {
  sources: string[];
}

const wrappedText = (text: string) =>
  text.split("\n").map((line, index) => (
    <span key={index}>
      {line} <br />
    </span>
  ));

const ChatBubble = ({ role = "assistant", content, sources }: Props) => {
  if (!content) return;

  const wrappedMessage = wrappedText(content);

  return (
    <div>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={role != "assistant" ? "text-amber-500" : "text-blue-500"}
          >
            {role === "assistant" ? "AI" : "You"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Balancer>{wrappedMessage}</Balancer>
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full">
            {sources && sources.length ? (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                suppressHydrationWarning
              >
                {sources.map((source, index) => (
                  <AccordionItem key={index} value={`source-${index}`}>
                    <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                    <AccordionContent>
                      <ReactMarkdown>{formattedText(source)}</ReactMarkdown>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <></>
            )}
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatBubble;

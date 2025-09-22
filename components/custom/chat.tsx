"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useProject } from "@/components/custom/project-context";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { SimpleModelSelector } from "./simple-model-selector";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const { selectedProject } = useProject();
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { 
        id,
        model: selectedModel,
        projectId: selectedProject,
      },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Messages Container */}
      <div className="flex-1 flex flex-row justify-center overflow-hidden pt-16">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 w-full max-w-3xl p-4 overflow-y-auto"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm">Choose a project from the sidebar and select a model below.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <PreviewMessage
                key={message.id}
                chatId={id}
                role={message.role}
                content={message.content}
                attachments={message.experimental_attachments}
                toolInvocations={message.toolInvocations}
              />
            ))
          )}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
      </div>

      {/* Input Form with Model Selector */}
      <div className="shrink-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Model:</span>
            <SimpleModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
          <form className="flex flex-row gap-2 relative items-end w-full">
            <MultimodalInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              append={append}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

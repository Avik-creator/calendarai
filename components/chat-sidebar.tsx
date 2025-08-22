"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status !== "ready") return;

    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const suggestedPrompts = [
    "Show me my events for this week",
    "Create a meeting with John tomorrow at 2 PM",
    "What's on my calendar today?",
    "Schedule a team meeting for Friday",
    "Delete my 3 PM meeting",
  ];

  const getToolCalls = () => {
    const toolCalls: any[] = [];
    messages.forEach((message: any) => {
      message.parts?.forEach((part: any) => {
        if (part.type === "tool-call") {
          toolCalls.push({
            messageId: message.id,
            toolName: part.toolName,
            args: part.args,
            role: message.role,
          });
        }
      });
    });
    return toolCalls;
  };

  const getToolResults = () => {
    const toolResults: any[] = [];
    messages.forEach((message: any) => {
      message.parts?.forEach((part: any) => {
        if (part.type === "tool-result") {
          const toolCall = message.parts?.find(
            (p: any) => p.type === "tool-call"
          );
          toolResults.push({
            messageId: message.id,
            toolName: toolCall?.toolName || "unknown",
            result: part.result,
            role: message.role,
          });
        }
      });
    });
    return toolResults;
  };

  const getTextMessages = () => {
    return messages
      .map((message: any) => ({
        ...message,
        parts: message.parts?.filter((part: any) => part.type === "text") || [],
      }))
      .filter((message: any) => message.parts.length > 0);
  };

  const toolCalls = getToolCalls();
  const toolResults = getToolResults();
  const textMessages = getTextMessages();

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-screen w-96 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out",
        "z-[9999]",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h2 className="font-semibold">AI Calendar Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          ×
        </Button>
      </div>

      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Tool Operations Section */}
        {(toolCalls.length > 0 || toolResults.length > 0) && (
          <div className="border-b border-border bg-muted/30">
            <div className="p-3 border-b border-border/50">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Settings className="w-4 h-4" />
                <span>Tool Operations</span>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto p-3 space-y-3">
              {/* Active Tool Calls */}
              {toolCalls.map((toolCall, index) => (
                <Tool
                  key={`tool-call-${toolCall.messageId}-${index}`}
                  defaultOpen={false}
                >
                  <ToolHeader
                    type={toolCall.toolName}
                    state="input-available"
                  />
                  <ToolContent>
                    <ToolInput input={toolCall.args} />
                  </ToolContent>
                </Tool>
              ))}

              {/* Tool Results */}
              {toolResults.map((toolResult, index) => (
                <Tool
                  key={`tool-result-${toolResult.messageId}-${index}`}
                  defaultOpen={false}
                >
                  <ToolHeader
                    type={toolResult.toolName}
                    state="output-available"
                  />
                  <ToolContent>
                    <ToolOutput
                      output={(() => {
                        const result = toolResult.result;
                        const toolName = toolResult.toolName;

                        switch (toolName) {
                          case "get_calendar_events":
                            if (
                              result?.events &&
                              Array.isArray(result.events)
                            ) {
                              return (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      Found {result.events.length} event
                                      {result.events.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                  {result.events.map(
                                    (event: any, eventIndex: number) => (
                                      <div
                                        key={eventIndex}
                                        className="bg-muted rounded p-3 border"
                                      >
                                        <div className="font-medium text-foreground">
                                          {event.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                          {new Date(
                                            event.start
                                          ).toLocaleDateString()}{" "}
                                          at{" "}
                                          {new Date(
                                            event.start
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                          {event.end &&
                                            ` - ${new Date(
                                              event.end
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}`}
                                        </div>
                                        {event.description && (
                                          <div className="text-sm text-muted-foreground mt-1">
                                            {event.description}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            }
                            return <Response>No events found</Response>;

                          case "create_calendar_event":
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                                  <Calendar className="w-4 h-4" />
                                  <span>Event Created Successfully</span>
                                </div>
                                {result?.event && (
                                  <div className="bg-green-50 dark:bg-green-950/20 rounded p-3 border border-green-200 dark:border-green-800">
                                    <div className="font-medium text-green-900 dark:text-green-100">
                                      {result.event.title}
                                    </div>
                                    <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                                      {new Date(
                                        result.event.start
                                      ).toLocaleDateString()}{" "}
                                      at{" "}
                                      {new Date(
                                        result.event.start
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );

                          case "update_calendar_event":
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 font-medium">
                                  <Calendar className="w-4 h-4" />
                                  <span>Event Updated Successfully</span>
                                </div>
                                {result?.event && (
                                  <div className="bg-orange-50 dark:bg-orange-950/20 rounded p-3 border border-orange-200 dark:border-orange-800">
                                    <div className="font-medium text-orange-900 dark:text-orange-100">
                                      {result.event.title}
                                    </div>
                                    <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                      Updated for{" "}
                                      {new Date(
                                        result.event.start
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );

                          case "delete_calendar_event":
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-medium">
                                  <Calendar className="w-4 h-4" />
                                  <span>Event Deleted Successfully</span>
                                </div>
                                {result?.deletedEvent && (
                                  <div className="bg-red-50 dark:bg-red-950/20 rounded p-3 border border-red-200 dark:border-red-800">
                                    <div className="font-medium text-red-900 dark:text-red-100">
                                      {result.deletedEvent.title}
                                    </div>
                                    <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                                      Removed from{" "}
                                      {new Date(
                                        result.deletedEvent.start
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );

                          case "get_current_date":
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium">
                                  <Calendar className="w-4 h-4" />
                                  <span>Current Date & Time</span>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-950/20 rounded p-3 border border-purple-200 dark:border-purple-800">
                                  <div className="font-medium text-purple-900 dark:text-purple-100">
                                    {result?.date
                                      ? new Date(
                                          result.date
                                        ).toLocaleDateString("en-US", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : "Date not available"}
                                  </div>
                                  {result?.time && (
                                    <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                      {result.time}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );

                          default:
                            return (
                              <Response>
                                {JSON.stringify(result, null, 2)}
                              </Response>
                            );
                        }
                      })()}
                      errorText={undefined}
                    />
                  </ToolContent>
                </Tool>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages Section */}
        <Conversation className="flex-1">
          <ConversationContent className="p-4">
            {textMessages.length === 0 && !error ? (
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation to manage your calendar!</p>
              </div>
            ) : (
              textMessages.map((message: any) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.parts?.map((part: any, index: number) => (
                      <Response key={`text-${index}`}>{part.text}</Response>
                    ))}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Error Display */}
        {error && (
          <div className="p-4 border-t border-border bg-background">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive mb-2">
                An error occurred: {error.message || "Please try again."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Suggested Prompts - Only show when no messages and no error */}
        {messages.length === 0 && !error && (
          <div className="p-4 border-t border-border bg-background">
            <p className="text-sm text-muted-foreground mb-3">
              Try asking me to:
            </p>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2 bg-transparent"
                  onClick={() => setInputValue(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
        <PromptInput onSubmit={handleSubmit} className="w-full">
          <PromptInputTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            placeholder="Ask me about your calendar..."
            disabled={status !== "ready"}
            className="pr-12 resize-none"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!inputValue.trim()}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
      </div>
    </div>
  );
}

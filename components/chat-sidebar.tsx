'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Send, Calendar, Clock, Users, Trash2, Edit, Plus, StopCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onRefreshCalendar: () => void
}

export default function ChatSidebar({ isOpen, onClose, onRefreshCalendar }: ChatSidebarProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: (message: any) => {
      // Check if there were tool calls and refresh calendar if needed
      console.log('message inside onFinish:', message)
      const hasToolCalls = message.parts?.some((part: any) => part.type === 'tool-call')
      if (hasToolCalls) {
        onRefreshCalendar()
      }
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || status !== 'ready') return

    sendMessage({ text: inputValue })
    setInputValue('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessageContent = (message: any) => {
    // Handle different message structures
    if (!message.parts || !Array.isArray(message.parts)) {
      // Fallback for messages without parts structure
      return <p>{message.content || 'No content available'}</p>
    }

    const textParts = []
    const toolParts = []

    message.parts.forEach((part: any, index: number) => {
      switch (part.type) {
        case 'text':
          textParts.push(
            <p key={`text-${index}`} className="whitespace-pre-wrap">
              {part.text}
            </p>
          )
          break
        
        case 'tool-call':
          toolParts.push(
            <div key={`tool-call-${index}`} className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-sm mt-2 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium mb-2">
                <Calendar className="w-4 h-4" />
                <span>Calling: {part.toolName}</span>
              </div>
              {part.args && Object.keys(part.args).length > 0 && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  <div className="font-medium mb-1">Parameters:</div>
                  <pre className="overflow-x-auto bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                    {JSON.stringify(part.args, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )
          break

        case 'tool-result':
          // Extract and format calendar events if available
          const result = part.result
          if (result?.events && Array.isArray(result.events)) {
            toolParts.push(
              <div key={`tool-result-${index}`} className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-sm mt-2 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Found {result.events.length} event{result.events.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {result.events.map((event: any, eventIndex: number) => (
                    <div key={eventIndex} className="bg-white dark:bg-gray-900 rounded p-2 border border-green-200 dark:border-green-700">
                      <div className="font-medium text-green-800 dark:text-green-200">{event.title}</div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {event.end && ` - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          } else {
            // Generic tool result display
            toolParts.push(
              <div key={`tool-result-${index}`} className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-sm mt-2 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Result</span>
                </div>
                <pre className="text-xs overflow-x-auto bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )
          }
          break

        case 'step-start':
          // You can choose to display this or ignore it
          break

        default:
          // Handle any unknown part types
          console.log('Unknown part type:', part.type, part)
          break
      }
    })

    return (
      <div>
        {textParts}
        {toolParts}
      </div>
    )
  }

  const suggestedPrompts = [
    "Show me my events for this week",
    "Create a meeting with John tomorrow at 2 PM",
    "What's on my calendar today?",
    "Schedule a team meeting for Friday",
    "Delete my 3 PM meeting",
  ]


  return (
    <div className={cn(
      "fixed right-0 top-0 h-screen w-96 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out",
      "z-[9999]",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
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

      {/* Messages Container */}
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !error ? (
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation to manage your calendar!</p>
            </div>
          ) : (
            messages.map((message: any) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}>
                  {renderMessageContent(message)}
                  <div className={cn(
                    "text-xs mt-2",
                    message.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {formatTime(new Date(message.createdAt || Date.now()))}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-medium">
                      {message.parts?.[0]?.text?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
          
          {(status === 'submitted' || status === 'streaming') && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 border-t border-border bg-background">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive mb-2">An error occurred: {error.message || 'Please try again.'}</p>
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
            <p className="text-sm text-muted-foreground mb-3">Try asking me to:</p>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => setInputValue(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your calendar..."
            disabled={status !== 'ready'}
            className="flex-1"
          />
          {(status === 'submitted' || status === 'streaming') ? (
            <Button type="button" onClick={() => stop()} variant="destructive" size="sm">
              <StopCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={!inputValue.trim()} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
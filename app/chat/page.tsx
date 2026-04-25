"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Coins, Send, Bot, User, Sparkles, TrendingUp, HelpCircle, Calculator, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickSuggestions = [
  { icon: TrendingUp, text: "Is now a good time to buy gold?" },
  { icon: HelpCircle, text: "What affects gold prices in Malaysia?" },
  { icon: Calculator, text: "How much gold can I buy with RM5000?" },
  { icon: Clock, text: "Should I wait for prices to drop?" },
]

// Helper component to handle timestamp hydration
function MessageTimestamp({ timestamp, isUser, hasContent }: { timestamp: Date; isUser: boolean; hasContent: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show timestamp if no content
  if (!hasContent) {
    return null
  }

  if (!mounted) {
    return <span className="text-xs mt-1 block" style={{ color: 'rgba(255,255,255,0.3)' }}>--:--</span>
  }

  return (
    <span className="text-xs mt-1 block" style={{ color: isUser ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)' }}>
      {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your Gold Investment AI Assistant. 

I can help you with:
- Understanding gold market trends
- Calculating buying amounts
- Timing your purchases
- Investment strategies

What would you like to know about gold investment today?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isTyping) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Create placeholder AI message for streaming
    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])

    try {
      console.log('[v0] Sending message to API:', messageText.substring(0, 30))
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      })

      console.log('[v0] API response status:', response.status)

      if (!response.ok) {
        console.log('[v0] API response not ok')
        throw new Error('API request failed')
      }

      const data = await response.json() as { response: string }
      console.log('[v0] API response received, length:', data.response?.length)

      // Update the AI message with the response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: data.response || 'No response received.', timestamp: new Date() }
            : msg
        )
      )

    } catch (error) {
      console.log('[v0] Error in handleSend:', error)
      
      // Update the placeholder message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: 'I encountered an error processing your message. Please try again.' }
            : msg
        )
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl sticky top-0 z-50" style={{ background: 'rgba(10,10,10,0.85)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center glow-gold">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Gold Digger AI</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analysis
            </Link>
            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/chat" className="text-sm text-foreground font-medium">
              AI Chat
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link href="/analysis">Start Analysis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Chat Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: '#1a1a1a', border: '1px solid rgba(197,157,95,0.2)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#c59d5f' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>AI-Powered Assistant</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Gold Investment Chat</h1>
          <p className="text-sm text-muted-foreground">Ask questions about gold investment in Malaysia</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 rounded-2xl mb-4 overflow-hidden border border-white/5" style={{ background: '#111111' }}>
          <div className="p-5 h-[50vh] overflow-y-auto">
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 items-end ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* AI Avatar — left side */}
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-1" style={{ background: '#1e1e1e', border: '1px solid rgba(212,167,83,0.2)' }}>
                      <Bot className="w-4 h-4" style={{ color: '#d4a753' }} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "rounded-3xl rounded-br-md"
                        : "rounded-3xl rounded-bl-md"
                    }`}
                    style={
                      message.role === "user"
                        ? { background: '#c59d5f', color: '#000' }
                        : { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid rgba(255,255,255,0.06)' }
                    }
                  >
                    {/* Loading dots inside the bubble when AI message has no content yet */}
                    {message.role === "assistant" && !message.content ? (
                      <div className="flex gap-1 py-1">
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(212,167,83,0.5)', animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(212,167,83,0.5)', animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(212,167,83,0.5)', animationDelay: "300ms" }} />
                      </div>
                    ) : message.role === "user" ? (
                      <p className="whitespace-pre-wrap font-medium leading-relaxed">{message.content}</p>
                    ) : (
                      <div className="prose prose-invert text-sm leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    <MessageTimestamp timestamp={message.timestamp} isUser={message.role === "user"} hasContent={!!message.content} />
                  </div>

                  {/* User Avatar — right side */}
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-1" style={{ background: '#c59d5f' }}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 2 && (
          <div className="mb-4">
            <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(suggestion.text)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(197,157,95,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  <suggestion.icon className="w-4 h-4 flex-shrink-0" style={{ color: '#c59d5f' }} />
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-3 p-3 rounded-2xl" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about gold investment..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-white/20"
            style={{ color: '#e5e5e5' }}
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all disabled:opacity-30"
            style={{ background: '#c59d5f' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#d4a753' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#c59d5f' }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(10,10,10,0.9)' }}>
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center">
            AI responses are for informational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

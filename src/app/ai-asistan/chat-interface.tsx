"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Global window interface extension for handleChatResponse
declare global {
  interface Window {
    handleChatResponse?: (data: any) => void;
  }
}

interface Message {
    text: string;
    sender: 'bot' | 'user';
    isError?: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Merhaba! Ben EKAP.AI asistanınızım. 👋", sender: "bot" },
    { text: "Kamu ihaleleri, KİK kararları veya mevzuat konusunda size nasıl yardımcı olabilirim?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Generate or retrieve chat session ID
  const getChatId = () => {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
        let chatId = sessionStorage.getItem("chatId");
        if (!chatId) {
        chatId = "chat_" + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("chatId", chatId);
        }
        return chatId;
    }
    return "chat_default";
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage: Message = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const messageToSend = inputMessage;
    setInputMessage("");

    try {
      const chatId = getChatId();
      const webhookUrl = "https://n8n.aab.tr/webhook/ekap";

    //   console.log("Sending message to:", webhookUrl);
    //   console.log("Chat ID:", chatId);

      // N8N workflow'unuzun beklediği format
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            key: {
              remoteJid: chatId,
            },
            message: {
              conversation: messageToSend,
            },
          },
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        // console.log("Response data:", responseData);

        const botMessage: Message = {
          text: responseData.output || responseData.message || "Yanıt alındı.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        const errorMsg: Message = {
          text: `Sunucuyla bağlantı kurulamadı. Hata kodu: ${response.status}`,
          sender: "bot",
          isError: true
        };
        setMessages((prev) => [...prev, errorMsg]);
        toast.error("İletişim Hatası", {
            description: "Sunucudan yanıt alınamadı. Lütfen daha sonra tekrar deneyin."
        });
      }
    } catch (error) {
      console.error("Detailed error:", error);
      const errorMsg: Message = {
        text: "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin.",
        sender: "bot",
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
      toast.error("Bağlantı Hatası", {
        description: "İnternet bağlantınızı kontrol edin."
      });
    } finally {
      setIsLoading(false);
      // Refocus the input after message is sent
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Helper to safely render HTML content with links
  const createMarkup = (htmlContent: string) => {
     // First convert markdown links: [Label](URL) -> <a href="URL">Label</a>
     let formatted = htmlContent.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-2 decoration-blue-300 dark:decoration-blue-700 hover:text-blue-600 dark:hover:text-blue-400">$1</a>'
      );

      // Then convert plain URLs: https://example.com -> <a href="...">...</a>
      formatted = formatted.replace(
        /(?<!href="|">)(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="font-medium underline underline-offset-2 decoration-blue-300 dark:decoration-blue-700 hover:text-blue-600 dark:hover:text-blue-400 break-all">$1</a>'
      );

    return { __html: formatted };
  };

  return (
    <div className="max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col h-[70vh] md:h-[650px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-4 shrink-0 flex items-center gap-3 shadow-md">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
                <h2 className="text-white font-bold text-lg">Asistan</h2>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    <span className="text-blue-100 text-xs font-medium">Çevrimiçi</span>
                </div>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-black/20">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex w-full",
                        message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                >
                    <div className={cn(
                        "flex max-w-[85%] md:max-w-[75%] gap-3",
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}>
                        {/* Avatar */}
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                            message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-indigo-600 text-white"
                        )}>
                            {message.sender === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        </div>

                        {/* Bubble */}
                        <div className={cn(
                            "p-3.5 md:p-4 rounded-2xl shadow-sm text-sm md:text-[15px] leading-relaxed",
                            message.sender === "user"
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-800 dark:text-gray-100 rounded-tl-none",
                            message.isError && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                        )}>
                            <div
                                className="prose dark:prose-invert prose-sm max-w-none break-words"
                                dangerouslySetInnerHTML={createMarkup(message.text)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex justify-start w-full">
                    <div className="flex max-w-[85%] gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                             <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Yanıt yazılıyor...</span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shrink-0">
            <div className="flex gap-3 relative">
                <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Merak ettiğiniz konuyu yazın..."
                    className="pr-12 h-12 text-base bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 focus-visible:ring-blue-500"
                    disabled={isLoading}
                />
                <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="absolute right-1 top-1 bottom-1 h-auto aspect-square rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    size="icon"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
            </div>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3 flex items-center justify-center gap-1.5">
                <AlertCircle className="h-3 w-3" />
                <span>Yapay zeka asistanı hata yapabilir. Önemli bilgileri her zaman mevzuattan kontrol ediniz.</span>
            </p>
        </div>
    </div>
  );
}

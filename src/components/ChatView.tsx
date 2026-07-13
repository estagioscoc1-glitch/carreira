import React, { useState, useEffect, useRef } from "react";
import { User, Message, ChatHistoryItem } from "../types";
import { LocalDB } from "../db";
import { 
  Send, Sparkles, Plus, Trash2, MessageSquareText, RefreshCw, User as UserIcon, Bot, ArrowRight, Brain 
} from "lucide-react";

interface ChatViewProps {
  user: User;
}

export default function ChatView({ user }: ChatViewProps) {
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("default_chat");
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat list on mount
  useEffect(() => {
    const userChats = LocalDB.getChats(user.id);
    setChats(userChats);
    if (userChats.length > 0) {
      setActiveChatId(userChats[0].id);
    }
  }, [user.id]);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, typing]);

  // Handle creating new chat session
  const handleNewChat = () => {
    const newChat = LocalDB.createNewChat(user.id);
    setChats(LocalDB.getChats(user.id));
    setActiveChatId(newChat.id);
  };

  // Handle deleting a chat session
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const updated = LocalDB.deleteChat(user.id, chatId);
    setChats(updated);
    if (activeChatId === chatId) {
      if (updated.length > 0) {
        setActiveChatId(updated[0].id);
      } else {
        // Create default
        const defaultChat = LocalDB.createNewChat(user.id);
        setChats(LocalDB.getChats(user.id));
        setActiveChatId(defaultChat.id);
      }
    }
  };

  // Handle sending message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || typing) return;

    // 1. Add User Message to DB & UI
    const updatedChats = LocalDB.addMessageToChat(user.id, activeChatId, {
      role: "user",
      text: text
    });
    setChats(updatedChats);
    setInputText("");
    setTyping(true);

    // 2. Query AI API via Server proxy
    try {
      const activeMessages = updatedChats.find(c => c.id === activeChatId)?.messages || [];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: activeMessages.map(m => ({ role: m.role, text: m.text })),
          provider: user.preferredProvider || "gemini",
          apiKey: user.openaiApiKey || "",
          studentProfile: {
            name: user.name,
            course: user.course,
            objective: user.objective,
            skills: user.skills,
            experience: user.experience,
            courses: user.courses,
            languages: user.languages,
            city: user.city
          }
        })
      });

      if (!response.ok) {
        throw new Error("Erro na resposta do servidor.");
      }

      const data = await response.json();
      
      // 3. Add AI response
      const finalChats = LocalDB.addMessageToChat(user.id, activeChatId, {
        role: "assistant",
        text: data.text || "Desculpe, ocorreu uma falha ao gerar a resposta."
      });
      setChats(finalChats);
    } catch (error: any) {
      console.error(error);
      const errorChats = LocalDB.addMessageToChat(user.id, activeChatId, {
        role: "assistant",
        text: "Desculpe-me, não consegui entrar em contato com os meus servidores de Inteligência Artificial no momento. Por favor, verifique se seu servidor e suas chaves estão configuradas corretamente e tente novamente em instantes."
      });
      setChats(errorChats);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  // Quick prompt suggestions
  const suggestions = [
    "Como formatar meu primeiro currículo sem ter experiência?",
    "Quais as perguntas mais frequentes em entrevistas de jovem aprendiz?",
    "Como destacar projetos práticos desenvolvidos no Lynx EDU?",
    "Quais habilidades interpessoais (soft skills) as empresas mais buscam?"
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8.5rem)] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden" id="chat-container">
      {/* LEFT SIDEBAR - CHAT HISTORY LIST */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between shrink-0 h-48 md:h-full">
        <div className="p-4 flex flex-col gap-3 overflow-hidden h-full">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 bg-blue-900 text-white hover:bg-blue-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
            id="chat-new-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Nova conversa</span>
          </button>

          {/* Session List */}
          <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Histórico</span>
            {chats.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs font-mono">Nenhum histórico.</div>
            ) : (
              chats.map((c) => {
                const isActive = c.id === activeChatId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition group border ${
                      isActive 
                        ? "bg-blue-50 border-blue-200 text-blue-900" 
                        : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <MessageSquareText className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span className="truncate pr-1">{c.title}</span>
                    </div>
                    {chats.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteChat(e, c.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition outline-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Info card at the bottom */}
        <div className="hidden md:block p-3.5 bg-slate-50 border-t border-slate-100 m-3 rounded-xl border border-slate-200/60">
          <div className="flex items-start gap-2.5">
            <Brain className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[10px] text-slate-500 leading-normal">
              {user.preferredProvider === "openai" ? (
                <span>Assistente ativo com o modelo <strong>OpenAI GPT-4o-mini</strong> via integração local.</span>
              ) : (
                <span>Assistente ativo com o modelo premium <strong>Gemini 3.5 Flash</strong> da Google AI.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - CHAT INTERACTIVE WINDOW */}
      <div className="flex-1 flex flex-col justify-between bg-white h-[calc(100%-12rem)] md:h-full relative">
        {/* Messages Scrolling Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="chat-messages-scroll">
          {activeChat?.messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div 
                key={m.id} 
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {/* Bot Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 border border-blue-800 shadow-sm shadow-blue-900/15">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-2xl flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border shadow-xs whitespace-pre-wrap ${
                      isUser 
                        ? "bg-blue-900 text-white border-blue-950" 
                        : "bg-slate-50 text-slate-800 border-slate-200/80"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">{m.timestamp}</span>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0">
                    <img 
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`} 
                      alt="User Avatar"
                      className="w-7 h-7 rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 border border-blue-800">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-2xl flex items-center gap-1.5 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Assistente digitando</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce duration-300" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce duration-300" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce duration-300" style={{ animationDelay: "300ms" }}></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Grid (shows only if messages has only 1 initial message and no typing/activity) */}
        {activeChat?.messages.length === 1 && !typing && (
          <div className="px-4 sm:px-6 pb-2" id="chat-suggestions">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Perguntas Frequentes</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-4xl">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s)}
                  className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs text-slate-700 transition hover:border-slate-300 flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <span className="truncate">{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Text Form Area */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shrink-0">
          <div className="relative flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua dúvida de carreira..."
              rows={1}
              className="w-full pl-4 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition resize-none max-h-24 pr-16"
              id="chat-input-textarea"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={typing || !inputText.trim()}
              className="absolute right-2 p-2 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition cursor-pointer shadow-sm"
              id="chat-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-center font-sans">
            A Inteligência Artificial pode cometer erros de interpretação. Sempre revise suas diretrizes com o setor de estágios do Colégio.
          </p>
        </div>
      </div>
    </div>
  );
}

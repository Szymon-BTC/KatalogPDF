import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2, HelpCircle } from 'lucide-react';
import { CatalogMetadata } from '../types';

interface AiCatalogAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogMetadata | null;
  currentPage: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiCatalogAssistant: React.FC<AiCatalogAssistantProps> = ({
  isOpen,
  onClose,
  catalog,
  currentPage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Cześć! Jestem Twoim inteligentnym Asystentem Katalogu. Zapytaj mnie o dowolne produkty, ceny, porady aranżacyjne lub specyfikacje w tym magazynie!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Gather catalog text context
      const currentPageObj = catalog?.pages.find((p) => p.pageNumber === currentPage);
      const currentPageText = currentPageObj?.text || '';
      
      const catalogContext = catalog?.pages
        .map((p) => `[Strona ${p.pageNumber}]: ${p.text}`)
        .join('\n') || '';

      const res = await fetch('/api/catalog-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          catalogContext,
          currentPageText,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Przepraszam, wystąpił błąd: ${err?.message || 'Nie udało się uzyskać odpowiedzi.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Podsumuj najciekawsze produkty w tym katalogu.',
    'Jakie są najdroższe i najtańsze przedmioty?',
    'Co polecasz na stronie, którą obecnie przeglądam?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 apple-glass border-l border-white/10 text-slate-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">AI Asystent Katalogu</h2>
            <p className="text-xs text-indigo-300 font-semibold">Powered by Gemini AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="apple-press-effect p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                msg.sender === 'user' ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] p-3.5 rounded-3xl text-xs leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-none shadow-amber-500/10'
                  : 'bg-black/40 border border-white/10 text-slate-100 rounded-tl-none backdrop-blur-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div
                className={`text-[9px] mt-1.5 text-right font-mono ${
                  msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-black/40 border border-white/10 p-3.5 rounded-3xl rounded-tl-none text-xs text-indigo-300 flex items-center gap-2 backdrop-blur-md">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analizuję treść katalogu...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-black/20 border-t border-white/10 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Szybkie pytania:</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputPrompt(q);
              }}
              className="apple-press-effect text-left text-[11px] text-slate-200 hover:text-amber-300 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl transition-all truncate border border-white/5"
            >
              &bull; {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-black/40 border-t border-white/10 flex gap-2">
        <input
          type="text"
          placeholder="Zadaj pytanie o meble, ceny..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-all"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="apple-press-effect p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

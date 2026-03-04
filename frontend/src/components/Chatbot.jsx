import React, { useState, useRef, useEffect } from "react";
import { askChatbot } from "../services/api";
import { MessageSquare, Send, X, Bot, Sparkles } from "lucide-react";

const accent = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Bonjour ! Comment puis-je vous aider dans vos projets aujourd'hui ?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await askChatbot(userMsg);
      setMessages(prev => [...prev, { role: "bot", text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Désolé, j'ai eu un problème de connexion." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 flex flex-col overflow-hidden animate-scaleIn"
          style={{
            width: "360px",
            height: "500px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 64px rgba(79,70,229,0.2), 0 0 0 1px rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.95)"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{
            background: accent,
            borderRadius: "28px 28px 0 0"
          }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{
                background: "rgba(255,255,255,0.2)"
              }}>
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                  ProjectFlow AI
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span className="text-white/70 text-[10px] font-medium">Propulsé par Gemini</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: "#f8faff" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeUp`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 mt-0.5" style={{
                    background: "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))"
                  }}>
                    <Sparkles size={13} style={{ color: "#4f46e5" }} />
                  </div>
                )}
                <div
                  className="max-w-[78%] px-4 py-3 text-sm leading-relaxed"
                  style={{
                    borderRadius: msg.role === "user"
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                    background: msg.role === "user"
                      ? accent
                      : "rgba(255,255,255,0.95)",
                    color: msg.role === "user" ? "white" : "#334155",
                    boxShadow: msg.role === "user"
                      ? "0 4px 12px rgba(79,70,229,0.25)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                    border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.95)" : "none",
                    fontWeight: "500"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fadeUp">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 flex-shrink-0" style={{
                  background: "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))"
                }}>
                  <Sparkles size={13} style={{ color: "#4f46e5" }} />
                </div>
                <div className="px-4 py-3 rounded-3xl" style={{
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.95)"
                }}>
                  <div className="dot-loader flex items-center gap-1">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="px-4 py-4 flex gap-2"
            style={{
              background: "rgba(255,255,255,0.97)",
              borderTop: "1px solid rgba(79,70,229,0.07)"
            }}
          >
            <input
              type="text"
              placeholder="Posez une question…"
              className="flex-1 text-sm font-medium rounded-2xl px-4 py-3 transition-all"
              style={{
                background: "#f8faff",
                border: "1.5px solid #e8eaf6",
                color: "#1e293b",
                outline: "none"
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#818cf8"}
              onBlur={e => e.target.style.borderColor = "#e8eaf6"}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90 flex-shrink-0"
              style={{
                background: isLoading || !input.trim() ? "#e2e8f0" : accent,
                boxShadow: isLoading || !input.trim() ? "none" : "0 4px 12px rgba(79,70,229,0.3)",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer"
              }}
            >
              <Send size={15} style={{ color: isLoading || !input.trim() ? "#94a3b8" : "white" }} />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90"
        style={{
          background: isOpen ? "#64748b" : accent,
          boxShadow: isOpen ? "0 4px 16px rgba(0,0,0,0.15)" : "0 8px 28px rgba(79,70,229,0.4)"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
};

export default Chatbot;
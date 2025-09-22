import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi Gargi, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Header */}
      <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 text-emerald-400">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-emerald-400">FinWell</h1>
          </Link>
        </div>

        {/* Navbar */}
        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Chatbot
          </Link>
        </nav>

        {/* User Options */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-gray-300">
              notifications
            </span>
          </button>
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2-ty28D6JOS9aNjjw9swQTpfZ_o-Kpxj9jXHJDViw37P8_Sd13CAiCL7HXswgRtpUCLT1EfVODPDR_wGlU_SnJSrVrYdVLmSc_stkEX1e4mxONK7kdrUw-ex8DP_iFeo2FbXZdclZ2X3HW6CENrr0c-goUrzG_36aSb6_RY_IfCot1hnIPW7AQg64S2WqMSkIypWaIu4Gc2gdqlS3jG-Er8M34VCZLKGtfkVIaJGwTqczWEAslBmkrZr2GDhNKWL1E6GFNXcuhDSh')",
            }}
          ></div>
        </div>
      </header>

      {/* Chat Main */}
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col flex-1 space-y-6 rounded-3xl bg-slate-900/80 border border-blue-900 shadow-lg shadow-blue-500/30 p-6">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4 text-center">
            Chat with FinWell
          </h2>

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 animate-slideUp ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Bot Avatar */}
                {msg.sender === "bot" && (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    <svg
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-emerald-900"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-md shadow-emerald-500/40"
                      : "bg-slate-700 text-gray-100 rounded-bl-md shadow-blue-500/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>

                {/* User Avatar */}
                {msg.sender === "user" && (
                  <div
                    className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 mt-1"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2-ty28D6JOS9aNjjw9swQTpfZ_o-Kpxj9jXHJDViw37P8_Sd13CAiCL7HXswgRtpUCLT1EfVODPDR_wGlU_SnJSrVrYdVLmSc_stkEX1e4mxONK7kdrUw-ex8DP_iFeo2FbXZdclZ2X3HW6CENrr0c-goUrzG_36aSb6_RY_IfCot1hnIPW7AQg64S2WqMSkIypWaIu4Gc2gdqlS3jG-Er8M34VCZLKGtfkVIaJGwTqczWEAslBmkrZr2GDhNKWL1E6GFNXcuhDSh')",
                    }}
                  ></div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0 mt-1">
                  🤖
                </div>
                <div className="px-5 py-4 rounded-2xl bg-slate-700 text-gray-100 max-w-2xl flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Chat Input */}
          <div className="mt-4 px-4 py-3 sticky bottom-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 rounded-xl">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-slate-800/60 border border-slate-700 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-200 placeholder-gray-400"
                placeholder="Ask me anything..."
                type="text"
              />
              <button
                onClick={handleSend}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-transform text-white px-5 py-3 rounded-full font-medium shadow-lg shadow-emerald-600/30"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}

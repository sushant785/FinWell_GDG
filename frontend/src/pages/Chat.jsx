import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import UserDropdown from "../components/UserDropdown";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🎨 Chart Component
const MyChartComponent = ({ visualization }) => {
  if (!visualization || !visualization.data) return null;

  const { chart_type, title, x_label, y_label, data } = visualization;
  const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="bg-slate-800 p-4 rounded-xl my-4 shadow-md">
      <h4 className="text-emerald-400 font-semibold mb-3 text-center">
        {title || "Visualization"}
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        {chart_type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis
              dataKey="x"
              stroke="#ccc"
              // label={{ value: x_label || "", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="#ccc"
              label={{ value: y_label || "", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="y" fill="#10b981" name={y_label || "Value"} radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : chart_type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis
              dataKey="x"
              stroke="#ccc"
              label={{ value: x_label || "", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="#ccc"
              label={{ value: y_label || "", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        ) : chart_type === "pie" ? (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={data} dataKey="y" nameKey="x" outerRadius={100} fill="#10b981" label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <p className="text-gray-400 text-center">Unsupported chart type.</p>
        )}
      </ResponsiveContainer>
    </div>
  );
};


// 🧠 Renders text messages (with bold, bullets, etc.)
const renderApiResponse = (responseData) => {
  if (typeof responseData === "string") {
    const elements = [];
    const lines = responseData.split("\n");
    let listItems = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("*")) {
        listItems.push(<li key={index}>{trimmedLine.replace(/^\*\s*/, "")}</li>);
      } else {
        if (listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="list-disc list-inside my-2 pl-4">{listItems}</ul>);
          listItems = [];
        }

        if (trimmedLine.startsWith("###")) {
          elements.push(
            <h3 key={index} className="text-lg font-bold my-3">
              {trimmedLine.replace(/^###\s*/, "")}
            </h3>
          );
        } else if (trimmedLine) {
          const parts = trimmedLine.split("**");
          const pElement = (
            <p key={index} className="my-2">
              {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
            </p>
          );
          elements.push(pElement);
        }
      }
    });

    if (listItems.length > 0) {
      elements.push(<ul key="ul-end" className="list-disc list-inside my-2 pl-4">{listItems}</ul>);
    }

    return elements;
  }

  return <p>Unsupported response format.</p>;
};

// 💬 Handles how each message appears
const MessageContent = ({ content, sender, visualization }) => {
  if (sender === "bot") {
    return (
      <div>
        {renderApiResponse(content)}
        {visualization && <MyChartComponent visualization={visualization} />}
      </div>
    );
  }
  return <p className="text-sm leading-relaxed">{content}</p>;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const csvUrl = localStorage.getItem("bankStatementUrl");
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (err) {
      console.log("Invalid token (frontend):", err);
    }
  }

  const [messages, setMessages] = useState([
    { sender: "bot", text: `Hi ${username || "there"}, how can I help you today?` },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userQuery = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, csv_filename: csvUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "An unknown error occurred.");
      }

      const data = await res.json();
      console.log("Backend Response:", data);

      // ⬇️ Store both text and visualization
      const botMessage = {
        sender: "bot",
        text: data.response.response,
        visualization: data.response.visualization || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Header */}
      <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="#" className="flex items-center gap-2">
            <div className="w-6 h-6 text-emerald-400">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-emerald-400">FinGuru</h1>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
            Dashboard
          </Link>
          <Link to="/chat" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
            Chatbot
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
          >
            Logout
          </button>
        </nav>
        <UserDropdown />
      </header>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col flex-1 space-y-6 rounded-3xl bg-slate-900/80 border border-blue-900 shadow-lg shadow-blue-500/30 p-6">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4 text-center">Chat with FinGuru</h2>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex items-start gap-3 animate-slideUp ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-1">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-2xl px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-md"
                        : "bg-slate-700 text-gray-100 rounded-bl-md"
                    }`}
                  >
                    <MessageContent
                      content={msg.text}
                      sender={msg.sender}
                      visualization={msg.visualization}
                    />
                  </div>

                  {msg.sender === "user" && (
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 mt-1"
                      style={{
                        backgroundImage:
                          "url('https://api.dicebear.com/7.x/adventurer/svg?seed=FinUser')",
                      }}
                    ></div>
                  )}
                </div>
              </div>
            ))}

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

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}

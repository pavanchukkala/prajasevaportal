"use client";
import React, { useState } from "react";

export default function MLAChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "assistant"; text: string }>>([
    {
      sender: "assistant",
      text: "Namaste! I am your Srikalahasti Intelligence Assistance engine. How can I assist you with live constituency cases, mandal stats, or legal directives today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(queryText?: string) {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mla/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "assistant", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: "Sorry, I could not fetch an update. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Network connection issue. Unable to reach Intelligence Assistance." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: "#fbbf24",
            color: "#0f172a",
            border: "none",
            borderRadius: "50px",
            padding: "12px 24px",
            fontWeight: 800,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(251,191,36,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🧠 Intelligence Assistance</span>
        </button>
      ) : (
        <div
          style={{
            width: "380px",
            height: "520px",
            backgroundColor: "#0f172a",
            border: "2px solid #fbbf24",
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "14px 16px",
              borderBottom: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🧠</span>
              <div>
                <h3 style={{ color: "#fbbf24", margin: 0, fontSize: "14px", fontWeight: 800 }}>
                  Intelligence Assistance
                </h3>
                <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 600 }}>
                  🟢 Real-Time Platform Engine
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px", fontWeight: "bold" }}
            >
              ✕
            </button>
          </div>

          {/* Quick prompt chips */}
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#162032",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
            }}
          >
            {[
              "🚨 Emergency Cases",
              "📊 Mandal Stats",
              "💧 Water Issues",
              "⚖️ Legal BNS Code",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                style={{
                  backgroundColor: "rgba(251,191,36,0.1)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251,191,36,0.3)",
                  borderRadius: "12px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: m.sender === "user" ? "#fbbf24" : "#1e293b",
                  color: m.sender === "user" ? "#0f172a" : "#f8fafc",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  maxWidth: "85%",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  border: m.sender === "assistant" ? "1px solid #334155" : "none",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ color: "#94a3b8", fontSize: "12px", fontStyle: "italic" }}>
                Analyzing live constituency database...
              </div>
            )}
          </div>

          {/* Input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "12px",
              backgroundColor: "#1e293b",
              borderTop: "1px solid #334155",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Intelligence Assistance..."
              style={{
                flex: 1,
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#f8fafc",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#fbbf24",
                color: "#0f172a",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontWeight: "bold",
                fontSize: "13px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

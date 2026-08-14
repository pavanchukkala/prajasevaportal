"use client";
import React, { useState, useRef, useEffect } from "react";

export default function MLAChatbot() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "assistant"; text: string }>>([
    {
      sender: "assistant",
      text: "Namaste! I am your Srikalahasti Executive Intelligence Assistance engine. How can I assist you with live constituency cases, mandal summaries, or legal directives today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
            padding: "14px 26px",
            fontWeight: 900,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(251,191,36,0.45)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "transform 0.2s ease, boxShadow 0.2s ease",
          }}
        >
          <span style={{ fontSize: "18px" }}>🧠</span>
          <span>Executive Intelligence AI</span>
        </button>
      ) : (
        <div
          style={{
            width: expanded ? "580px" : "420px",
            height: expanded ? "680px" : "560px",
            backgroundColor: "#0f172a",
            border: "2px solid #fbbf24",
            borderRadius: "18px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.75)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "sans-serif",
            transition: "all 0.25s ease-in-out",
            maxWidth: "92vw",
            maxHeight: "85vh",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "14px 18px",
              borderBottom: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "22px" }}>🧠</span>
              <div>
                <h3 style={{ color: "#fbbf24", margin: 0, fontSize: "15px", fontWeight: 900 }}>
                  Executive Intelligence Engine
                </h3>
                <span style={{ color: "#34d399", fontSize: "11px", fontWeight: 700 }}>
                  🟢 Active Constituency Assistant
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setExpanded(!expanded)}
                title={expanded ? "Collapse window" : "Expand window"}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {expanded ? "↙ Collapse" : "⤢ Expand"}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "bold",
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#162032",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
            }}
          >
            {[
              "🚨 Emergency Safety Cases",
              "📊 Mandal Breakdown",
              "💧 Water Supply Issues",
              "⚖️ Legal BNS / POCSO Directives",
              "🏛️ MLA Information",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                style={{
                  backgroundColor: "rgba(251,191,36,0.12)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251,191,36,0.35)",
                  borderRadius: "14px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: "18px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: m.sender === "user" ? "#fbbf24" : "#1e293b",
                  color: m.sender === "user" ? "#0f172a" : "#f8fafc",
                  borderRadius: "14px",
                  padding: "12px 16px",
                  maxWidth: "90%",
                  fontSize: "13.5px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  border: m.sender === "assistant" ? "1px solid #334155" : "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ color: "#38bdf8", fontSize: "12px", fontStyle: "italic", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>⚡</span> Analyzing live constituency database & legal statutes...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "14px",
              backgroundColor: "#1e293b",
              borderTop: "1px solid #334155",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Intelligence Assistant..."
              style={{
                flex: 1,
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "#f8fafc",
                fontSize: "13.5px",
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
                borderRadius: "10px",
                padding: "10px 18px",
                fontWeight: 900,
                fontSize: "14px",
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

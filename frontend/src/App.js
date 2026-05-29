import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // 대화 목록 - 나중에 실제 대화 저장 기능 구현 시 사용
  const [chatHistory] = useState([
    "Rephrase text...",
    "Fix this code ne...",
    "Sample Copy for...",
  ]);
  // 사이드바 열림/닫힘 상태
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // AI 응답 생성 함수 - 백엔드 /chat 호출
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "서버 연결 실패" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5", fontFamily: "sans-serif" }}>

      {/* 사이드바 */}
      {sidebarOpen && (
        <div style={{ width: "260px", background: "#0d1117", display: "flex", flexDirection: "column", padding: "16px", gap: "8px" }}>

          {/* 사이드바 토글 버튼 */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ alignSelf: "flex-end", background: "transparent", border: "1px solid #333", color: "#fff", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", marginBottom: "8px" }}
          >
            ☰
          </button>

          {/* New Chat 버튼 */}
          <button
            onClick={() => setMessages([])}
            style={{ background: "#1a1f2e", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "10px 14px", cursor: "pointer", textAlign: "left" }}
          >
            + New Chat
          </button>

          {/* Recent Chats 섹션 */}
          <button style={{ background: "#1a1f2e", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
            ↩ Recent Chats
          </button>

          {/* 이전 대화 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                style={{ color: "#aaa", fontSize: "14px", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}
                onMouseEnter={(e) => (e.target.style.background = "#1a1f2e")}
                onMouseLeave={(e) => (e.target.style.background = "transparent")}
              >
                {chat}
              </div>
            ))}
          </div>

          {/* 하단 사용자 정보 */}
          <div style={{ marginTop: "auto", background: "#1a1f2e", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
              👤
            </div>
            <div>
              <div style={{ color: "#aaa", fontSize: "12px" }}>Welcome back,</div>
              <div style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>User</div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 채팅 영역 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* 상단 헤더 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#fff", borderBottom: "1px solid #e0e0e0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* 사이드바 닫혀있을 때 토글 버튼 */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}
              >
                ☰
              </button>
            )}
          </div>
          {/* 검색창 */}
          <input
            type="text"
            placeholder="🔍 Search"
            style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid #ddd", outline: "none", width: "220px", fontSize: "14px" }}
          />
        </div>

        {/* 대화 내역 영역 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px" }}
            >
              {/* 봇 아바타 */}
              {msg.role === "bot" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                  🤖
                </div>
              )}

              {/* 메시지 말풍선 */}
              <div
                style={{
                  maxWidth: "60%",
                  padding: "12px 16px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "#fff" : "#fff",
                  border: msg.role === "user" ? "1px solid #ddd" : "none",
                  borderLeft: msg.role === "bot" ? "3px solid #4CAF50" : "none",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#333",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {msg.content}
              </div>

              {/* 유저 아바타 */}
              {msg.role === "user" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ff8a65", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {/* 응답 대기 중 표시 */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
              <div style={{ padding: "12px 16px", background: "#fff", borderRadius: "16px", fontSize: "14px", color: "#aaa" }}>입력 중...</div>
            </div>
          )}
        </div>

        {/* 입력창 영역 */}
        <div style={{ padding: "16px 40px", background: "#fff", borderTop: "1px solid #e0e0e0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "8px 16px" }}>
            <input
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "14px", color: "#333" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a new message here"
            />
            {/* 전송 버튼 */}
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: loading ? "#ccc" : "#333" }}
            >
              ▷
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
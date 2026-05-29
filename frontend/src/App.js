import { useState } from "react";

// 백엔드 서버 주소
const API_URL = "http://127.0.0.1:8000";

function App() {
  // messages: 대화 내역 저장 배열 [{role: "user"/"bot", content: "내용"}]
  const [messages, setMessages] = useState([]);
  // input: 현재 입력창 텍스트
  const [input, setInput] = useState("");
  // loading: 백엔드 응답 기다리는 중 여부
  const [loading, setLoading] = useState(false);

  // 메시지 전송 함수 - 백엔드 /chat 엔드포인트 호출
  const sendMessage = async () => {
    if (!input.trim()) return; // 빈 메시지 전송 방지

    const userMessage = { role: "user", content: input };

    // 사용자 메시지 대화 내역에 추가
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

      // 봇 응답 대화 내역에 추가
      const botMessage = { role: "bot", content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // 백엔드 연결 실패 시 에러 메시지 표시
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "서버 연결 실패" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h2>AI 챗봇</h2>

      {/* 대화 내역 표시 영역 */}
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            {/* 발신자 표시 */}
            <span style={{ fontSize: "12px", color: "#888" }}>
              {msg.role === "user" ? "나" : "봇"}
            </span>
            {/* 메시지 말풍선 */}
            <div
              style={{
                display: "inline-block",
                background: msg.role === "user" ? "#007bff" : "#f1f1f1",
                color: msg.role === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "12px",
                maxWidth: "80%",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {/* 응답 대기 중 표시 */}
        {loading && <div style={{ color: "#888" }}>응답 중...</div>}
      </div>

      {/* 입력창 + 전송 버튼 */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          style={{ flex: 1, padding: "8px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage} disabled={loading}>
          전송
        </button>
      </div>
    </div>
  );
}

export default App;
# FastAPI: 웹 서버 프레임워크
from fastapi import FastAPI
# CORS: 프론트엔드에서 백엔드 호출 허용 설정
from fastapi.middleware.cors import CORSMiddleware
# BaseModel: 요청 데이터 형식 정의할 때 사용
from pydantic import BaseModel
# Groq: Groq API 호출 클라이언트 (임시 모델, 나중에 우리 모델로 교체)
from groq import Groq
# load_dotenv: .env 파일에서 환경변수 불러오기
from dotenv import load_dotenv
import os

# .env 파일 로드 (API 키 등 민감한 정보를 코드에 직접 쓰지 않기 위함)
load_dotenv()

# FastAPI 앱 인스턴스 생성 (서버의 핵심 객체)
app = FastAPI()

# CORS 미들웨어 설정
# 프론트엔드와 백엔드가 다른 포트를 사용하기 때문에 브라우저가 기본적으로 요청을 차단함
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 모든 출처 허용 (개발용. 실서비스엔 특정 도메인만 허용해야 함)
    allow_methods=["*"],
    allow_headers=["*"],
)

# 채팅 요청 데이터 형식 정의
class ChatRequest(BaseModel):
    message: str  # 사용자가 입력한 메시지

# AI 응답 생성 함수 - 나중에 우리 모델로 교체할 핵심 함수
def get_ai_response(message: str) -> str:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",  # Groq에서 제공하는 무료 LLaMA 모델
        messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message.content

# /chat 엔드포인트 (POST 방식)
# 프론트엔드에서 메시지를 받아 AI에 전달하고 응답을 돌려주는 엔드포인트
@app.post("/chat")
def chat(req: ChatRequest):
    response = get_ai_response(req.message)
    return {"response": response}

# / 엔드포인트 (GET 방식)
# 서버 정상 동작 확인용 헬스체크
@app.get("/")
def root():
    return {"status": "ok"}
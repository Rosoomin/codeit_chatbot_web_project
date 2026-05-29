# FastAPI: 웹 서버 프레임워크
from fastapi import FastAPI
# CORS: 프론트엔드에서 백엔드 호출 허용 설정
from fastapi.middleware.cors import CORSMiddleware
# BaseModel: 요청 데이터 형식 정의할 때 사용
from pydantic import BaseModel
# OpenAI: OpenAI API 호출 클라이언트
from openai import OpenAI
# load_dotenv: .env 파일에서 환경변수 불러오기
from dotenv import load_dotenv
import os

# .env 파일 로드 (API 키 등 민감한 정보를 코드에 직접 쓰지 않기 위함)
load_dotenv()

# FastAPI 앱 인스턴스 생성 (서버의 핵심 객체)
app = FastAPI()

# CORS 미들웨어 설정
# 프론트엔드와 백엔드가 다른 포트를 사용하기 때문에 브라우저가 기본적으로 요청을 차단함
# 이를 허용해주는 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 모든 출처 허용 (개발용. 실서비스엔 특정 도메인만 허용해야 함)
    allow_methods=["*"],   # 모든 HTTP 메서드 허용
    allow_headers=["*"],   # 모든 헤더 허용
)

# 실제 요청이 들어올 때 초기화
def get_ai_response(message: str) -> str:
    # 나중에 우리 모델로 교체할 함수
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message.content

# 채팅 요청 데이터 형식 정의
# 프론트엔드에서 보낸 요청 데이터를 자동으로 파싱
class ChatRequest(BaseModel):
    message: str  # 사용자가 입력한 메시지

# /chat 엔드포인트 (POST 방식)
# 프론트엔드에서 메시지를 받아 OpenAI에 전달하고 응답을 돌려주는 핵심 함수
@app.post("/chat")
def chat(req: ChatRequest):
    response = get_ai_response(req.message)
    return {"response": response}

# / 엔드포인트 (GET 방식)
# 서버 정상 동작 확인용 헬스체크
@app.get("/")
def root():
    return {"status": "ok"}
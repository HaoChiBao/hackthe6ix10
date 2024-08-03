from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from models import *
import instructor
import json
import os
import time

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the OpenAI client with the API key from .env
openai_api_key = os.getenv("OPENAI_API_KEY")
client = instructor.from_openai(OpenAI(api_key=openai_api_key))


@app.get("/")
def read_root():
    return {"Hello": "World"}


# Asynchronous generator for streaming responses
async def create_partial_instance(
    input: str, ResponseModel: instructor.Partial[ReturnData]
):
    return client.chat.completions.create(
        model="gpt-4-turbo",
        temperature=0.1,
        messages=[{"role": "user", "content": input}],
        response_model=ResponseModel,
        stream=True,
    )


# Function to get new content
async def get_new(previous: str, response: str) -> str:
    # time.sleep(1)
    if not response:
        return ""

    for i in range(min(len(previous), len(response))):
        if response[i] != previous[i]:
            return response[i:]

    return ""


@app.websocket("/ws")
async def websocket_generate_html(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")

    try:
        message = await websocket.receive_json()
        data = message.get("data")
        print("Received data:", data)

        if data and data.get("prompt"):
            prompt = data.get("prompt")
            print("Prompt received: ", prompt)

            Response = instructor.Partial[ReturnData]
            stream = await create_partial_instance(prompt, Response)
            current_output = ""

            for response in stream:
                obj = response.model_dump()
                string_code = obj.get("code")
                print("String code: ", string_code)
                # new_string = await get_new(current_output, string_code)
                # current_output += new_string
                # print("Current Output: ", current_output)
                await websocket.send_text(
                    json.dumps(
                        {"action": "generateNew", "data": {"prompt": string_code}}
                    )
                )
        else:
            await websocket.send_text("No prompt provided, just waiting")
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error occurred: {e}")

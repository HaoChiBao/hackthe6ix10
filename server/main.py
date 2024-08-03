from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models import *
import instructor
from typing import Iterable
from openai import OpenAI
from dotenv import load_dotenv
import json
import os

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
openai_client = OpenAI(api_key=openai_api_key)
# Patch the OpenAI client
client = instructor.from_openai(OpenAI())

@app.get("/")
def read_root():
    return {"Hello": "World"}

# create the partial instance from instructor
def create_partial_instance(input: str, ResponseModel: instructor.Partial[ReturnData]):
    return client.chat.completions.create(
        model="gpt-4-turbo",  # Use a valid and accessible model
        temperature=0.1,
        messages=[{"role": "user", "content": input}],
        response_model=ResponseModel,
        stream=True,
    )

# string manipulation to get the new content
def get_new(previous: str, response: str) -> str:
    if not response:
        return ""
    
    # Determine the index where new content starts
    for i in range(min(len(previous), len(response))):
        if response[i] != previous[i]:
            return response[i:]
        
    return ""

# WebSocket endpoint for generating HTML
@app.websocket("/ws/generateHTML")
async def websocket_generate_html(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            prompt = data.get("prompt")
            Response = instructor.Partial[ReturnData]
            current_output = ""

            for response in create_partial_instance(prompt, Response):
                obj = response.model_dump()
                current_output = current_output + get_new(current_output, obj.get("code"))
                print(current_output)
                await websocket.send_text(current_output)
    except WebSocketDisconnect:
        print("Client disconnected")

@app.post("/generateHTML")
async def generate_html(data: HTMLGenerationPrompt):
    # data.prompt = ""
    Response = instructor.Partial[ReturnData]
    # try:
        # `create` returns a synchronous iterable when `stream=True`
    
    current_output = ""

    for response in create_partial_instance(data.prompt, Response):
        obj = response.model_dump()
        print(obj)
        current_output = current_output + get_new(current_output, obj.get("code"))
        print("\nHi\n")
        print(response )

    #     async def generate():
    #         for chunk in response_stream:
    #             try:
    #                 # Extract the message content directly from the ChatCompletionChunk object
    #                 if chunk.choices[0].delta.get("content"):
    #                     html_code = chunk.choices[0].delta["content"]
    #                     yield html_code + "\n"
    #             except Exception as e:
    #                 print(f"Error extracting HTML: {e}")
    #                 continue

    #     return StreamingResponse(generate(), media_type="text/html")
    # except instructor.exceptions.InstructorRetryException as e:
    #     raise HTTPException(status_code=500, detail="Model not found or access denied.")
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    


# @app.post("/generateCSS")
# async def generate_css(data: CSSGenerationPrompt):
#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         response_model=ReturnData,
#         messages=[{"role": "user", "content": data.prompt}],
#     )
#     return {"prompt": data.prompt, "css": response.code}


@app.post("/generateCSS")
async def generate_css(data: CSSGenerationPrompt):
    async def generate():
        response_stream = await client.chat.completions.create(
            model="gpt-4o",  # Use the desired model here
            response_model=ReturnData,
            messages=[{"role": "user", "content": data.prompt}],
            stream=True,
        )
        async for response in response_stream:
            yield response.json() + "\n"

    return StreamingResponse(generate(), media_type="application/json")


# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     try:
#         while True:
#             data = await websocket.receive_json()
#             # Extract and process the received data
#             orchestration_data = OrchestrationLayer(**data)
#             # Handle HTML and CSS generation in parallel
#             html_task = generate_html(orchestration_data)
#             css_task = generate_css(orchestration_data)
#             html_result, css_result = await asyncio.gather(html_task, css_task)
            
#             # Send the results back to the client
#             await websocket.send_json({"type": "html", "content": html_result})
#             await websocket.send_json({"type": "css", "content": css_result})
#     except Exception as e:
#         await websocket.send_text(f"Error: {str(e)}")
#     finally:
#         await websocket.close()

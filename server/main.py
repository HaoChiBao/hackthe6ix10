from fastapi import FastAPI, WebSocket
from models import *
import instructor
from openai import OpenAI
import asyncio


app = FastAPI()

# Patch the OpenAI client
client = instructor.from_openai(OpenAI())

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            # Extract and process the received data
            orchestration_data = OrchestrationLayer(**data)
            # Handle HTML and CSS generation in parallel
            html_task = generate_html(orchestration_data)
            css_task = generate_css(orchestration_data)
            html_result, css_result = await asyncio.gather(html_task, css_task)
            
            # Send the results back to the client
            await websocket.send_json({"type": "html", "content": html_result})
            await websocket.send_json({"type": "css", "content": css_result})
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()


@app.post("/generateHTML")
async def generate_html(data: OrchestrationLayer):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=ReturnData,
        messages=[{"role": "user", "content": data.prompt}],
    )
    return {"prompt": data.prompt, "html": response.code}

@app.post("/generateCSS")
async def generate_css(data: OrchestrationLayer):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=ReturnData,
        messages=[{"role": "user", "content": data.prompt}],
    )
    return {"prompt": data.prompt, "css": response.code}

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from models import *
import instructor
import json
import os
import time
import asyncio


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

# Example knowledge base
examples = {
    "landing page": {
        "html": """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Roboto:wght@300;400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="navbar">
        <div class="container">
            <div class="logo">MyBrand</div>
            <nav>
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <h1>Welcome to MyBrand</h1>
            <p>Your success is our mission. Discover our services and make your business thrive.</p>
            <a href="#contact" class="cta-button">Get Started</a>
        </div>
    </section>
    <section id="features" class="features">
        <div class="container">
            <h2>Our Features</h2>
            <div class="feature-list">
                <div class="feature">
                    <h3>Feature One</h3>
                    <p>Explanation of Feature One</p>
                </div>
                <div class="feature">
                    <h3>Feature Two</h3>
                    <p>Explanation of Feature Two</p>
                </div>
                <div class="feature">
                    <h3>Feature Three</h3>
                    <p>Explanation of Feature Three</p>
                </div>
            </div>
        </div>
    </section>
    <section id="testimonials" class="testimonials">
        <div class="container">
            <h2>What Our Clients Say</h2>
            <div class="testimonial-cards">
                <div class="testimonial">
                    <p>"MyBrand helped us achieve our goals seamlessly. Highly recommended!"</p>
                    <span>- Satisfied Client</span>
                </div>
                <div class="testimonial">
                    <p>"Their service is outstanding. We couldn't be happier with the results."</p>
                    <span>- Happy Customer</span>
                </div>
                <div class="testimonial">
                    <p>"Professional and efficient. MyBrand is our go-to consultancy."</p>
                    <span>- Loyal Client</span>
                </div>
            </div>
        </div>
    </section>
    <section id="contact" class="contact">
        <div class="container">
            <h2>Contact Us</h2>
            <form>
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 MyBrand. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
        """,
        "css": """
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.navbar {
    background-color: #333;
    padding: 10px 0;
    color: #fff;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar .logo {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 600;
}

.navbar nav ul {
    list-style: none;
    display: flex;
    gap: 15px;
    margin: 0;
    padding: 0;
}

.navbar nav ul li a {
    color: #fff;
    text-decoration: none;
    font-weight: 400;
}

.hero {
    background: #007bff;
    color: #fff;
    text-align: center;
    padding: 80px 0;
}

.hero .container {
    max-width: 800px;
    margin: 0 auto;
}

.hero h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 20px;
}

.hero p {
    font-size: 18px;
    margin-bottom: 40px;
}

.hero .cta-button {
    background-color: #e74c3c;
    color: #fff;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: 600;
}

.features, .testimonials, .contact {
    padding: 60px 0;
    text-align: center;
}

.features .container, .testimonials .container, .contact .container {
    max-width: 800px;
    margin: 0 auto;
}

.feature-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.feature {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    width: 30%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    margin-bottom: 10px;
}

.feature p {
    font-size: 16px;
}

.testimonial-cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
}

.testimonial {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    width: 30%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testimonial p {
    font-style: italic;
}

.testimonial span {
    display: block;
    margin-top: 10px;
    font-weight: 600;
}

.contact form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.contact form input, .contact form textarea, .contact form button {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
}

.contact form button {
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 20px 0;
    margin-top: 40px;
}
        """
    },
    "contact form": {
        "html": """
<form>
    <input type="text" placeholder="Your Name" required>
    <input type="email" placeholder="Your Email" required>
    <textarea placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
</form>
        """,
        "css": """
form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 600px;
    margin: 0 auto;
}

form input, form textarea, form button {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
}

form button {
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
    font-weight: 600;
}
        """
    },
    "hero section": {
        "html": """
<section class="hero">
    <div class="container">
        <h1>Welcome to MyBrand</h1>
        <p>Your success is our mission. Discover our services and make your business thrive.</p>
        <a href="#contact" class="cta-button">Get Started</a>
    </div>
</section>
        """,
        "css": """
.hero {
    background: #007bff;
    color: #fff;
    text-align: center;
    padding: 80px 0;
}

.hero .container {
    max-width: 800px;
    margin: 0 auto;
}

.hero h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 20px;
}

.hero p {
    font-size: 18px;
    margin-bottom: 40px;
}

.hero .cta-button {
    background-color: #e74c3c;
    color: #fff;
    padding: 10px 20px;
    }
        """
    }
}

def retrieve_examples(prompt):
    print(examples)
    keywords = prompt.lower().split()
    relevant_examples = {key: val for key, val in examples.items() if any(keyword in key for keyword in keywords)}
    return relevant_examples

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Asynchronous generator for streaming responses for HTML generation
async def code_generation(input, html_code, css_context, ResponseModel):
    print("Prompt:", input)
    print("HTML Code:", html_code)
    print("CSS Context:", css_context)
    
    # Retrieve examples based on the prompt
    examples = retrieve_examples(input)
    example_html = "\n".join([example['html'] for example in examples.values()])
    example_css = "\n".join([example['css'] for example in examples.values()])
    
    # Incorporate examples into the prompt
    prompt_with_examples = (
        f"You are a professional web developer who makes beautiful, modern websites. Given the user prompt, return vanilla HTML and CSS code that fulfills the user's request. If the following HTML Context and CSS Context is empty, then create a new website. "
        f"If there is HTML Context and CSS Context, please take that into account.\n\n"
        f"When returning the code, please include Google Font Imports and use modern styling to make the websites prettier. "
        f"Include images through img tags with very descriptive keywords for alt text. DO NOT include background images of elements. "
        f"DO NOT include position: absolute or position: fixed.\n\n"
        f"Prompt: {input}\n\n"
        f"HTML Code:\n{html_code}\n\n"
        f"CSS Context:\n{css_context}\n\n"
        f"Examples of good HTML and CSS:\n\n"
        f"HTML Examples:\n{example_html}\n\n"
        f"CSS Examples:\n{example_css}"
    )

    return client.chat.completions.create(
        model="gpt-4o",
        temperature=0.1,
        messages=[
            {
                "role": "user",
                "content": prompt_with_examples,
            }
        ],
        response_model=ResponseModel,
        stream=True,
    )

async def code_classifier(input, html_code, css_context):
    print("Prompt:", input)
    print("HTML Code:", html_code)
    print("CSS Context:", css_context)
    return client.chat.completions.create(
        model="gpt-4o",
        temperature=0.1,
        messages=[
            {
                "role": "user",
                "content": f"Prompt: {input} I am asking you to classify the following HTML Code and CSS Context\n\nHTML Code:\n{html_code}\n\nCSS Context:\n{css_context}.",
            }
        ],
        response_model=instructor.Partial[ReturnData],
        stream=False,
    )

@app.websocket("/ws")
async def websocket_generate_html(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")

    try:
        while True:  # Continuously listen for new messages
            message = await websocket.receive_json()
            data = message.get("data")
            print("Received data:", data)

            if data and data.get("prompt"):
                prompt = data.get("prompt")
                html = data.get("html")
                css = data.get("css")
                print("Prompt received:", prompt)
                print("HTML received:", html)
                print("CSS received:", css)

                response_model = instructor.Partial[ReturnData]
                stream = await code_generation(prompt, html, css, response_model)

                for response in stream:
                    obj = response.model_dump()
                    html_string_code = obj.get("html")
                    css_string_code = obj.get("css")

                    await websocket.send_text(
                        json.dumps(
                            {
                                "action": "newCode",
                                "data": {
                                    "html": html_string_code,
                                    "css": css_string_code,
                                },
                            }
                        )
                    )
            else:
                await websocket.send_text("No prompt provided, just waiting")
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error occurred: {e}")

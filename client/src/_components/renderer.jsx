import React, { useEffect } from "react";
import DOMPurify from "dompurify";

export default function Renderer() {
  const html = `
    <header>
        <h1>Welcome to LoveConnect</h1>
        <p>Find your perfect match today!</p>
    </header>
    <section class="hero">
        <h2>Meet New People</h2>
        <p>Join the best dating app and find your true love.</p>
    </section>
    <section class="features">
        <h2>Why Choose LoveConnect?</h2>
        <div class="feature-item">
            <h3>Easy to Use</h3>
            <p>Our app is user-friendly and easy to navigate.</p>
        </div>
        <div class="feature-item">
            <h3>Secure</h3>
            <p>Your privacy and security are our top priorities.</p>
        </div>
        <div class="feature-item">
            <h3>Millions of Users</h3>
            <p>Connect with millions of singles around the world.</p>
        </div>
    </section>
    <section class="signup-form">
        <h2>Sign Up Now</h2>
        <form>
            <input type="text" placeholder="Full Name" required>
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Get Started</button>
        </form>
    </section>
    <footer>
        <p>&copy; 2024 LoveConnect. All rights reserved.</p>
    </footer>
  `;

  const css = `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #ff6f61;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .hero {
      background: url('hero-image.jpg') no-repeat center center;
      background-size: cover;
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    .features {
      padding: 50px 20px;
      text-align: center;
    }
    .features h2 {
      margin-bottom: 20px;
    }
    .feature-item {
      margin-bottom: 20px;
    }
    .signup-form {
      background-color: #f8f8f8;
      padding: 50px 20px;
      text-align: center;
    }
    .signup-form form {
      max-width: 400px;
      margin: 0 auto;
    }
    .signup-form input, .signup-form button {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    footer {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
    }
  `;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [css]);

  const sanitizedHTML = DOMPurify.sanitize(html);

  return (
    <main className="main">
      <div className="">
        <label for="html">HTML:</label>
        <textarea id="html" type="text" value={html} />
        <label for="css">CSS:</label>
        <textarea id="css" type="text" value={css} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    </main>
  );
}

import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export default function Renderer() {
  const [htmlInput, setHtmlInput] = useState(`
    <body>
    <header class="header">
        <div class="container">
            <h1 class="header-title">Welcome to CRM System</h1>
            <p class="header-subtitle">Streamline your customer relationships with ease</p>
            <a href="#features" class="cta-button">Learn More</a>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <img src="path/to/hero-image.jpg" alt="CRM dashboard overview" class="hero-image">
            <h2 class="hero-heading">Transform Your Customer Experience</h2>
            <p class="hero-description">Our CRM solution provides you with all the tools you need to manage and enhance customer interactions.</p>
            <a href="#get-started" class="cta-button">Get Started</a>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <h2 class="features-title">Features</h2>
            <div class="features-list">
                <div class="feature-item">
                    <img src="path/to/feature1-image.jpg" alt="Feature 1 description" class="feature-image">
                    <h3 class="feature-title">Feature 1</h3>
                    <p class="feature-description">Description of feature 1.</p>
                </div>
                <div class="feature-item">
                    <img src="path/to/feature2-image.jpg" alt="Feature 2 description" class="feature-image">
                    <h3 class="feature-title">Feature 2</h3>
                    <p class="feature-description">Description of feature 2.</p>
                </div>
                <div class="feature-item">
                    <img src="path/to/feature3-image.jpg" alt="Feature 3 description" class="feature-image">
                    <h3 class="feature-title">Feature 3</h3>
                    <p class="feature-description">Description of feature 3.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="testimonial">
        <div class="container">
            <h2 class="testimonial-title">What Our Customers Say</h2>
            <blockquote class="testimonial-quote">
                <p class="quote-text">"This CRM system has transformed our customer management process. Highly recommend!"</p>
                <footer class="quote-author">— Customer Name, Company</footer>
            </blockquote>
        </div>
    </section>

    <section class="call-to-action" id="get-started">
        <div class="container">
            <h2 class="cta-title">Ready to Enhance Your Customer Management?</h2>
            <a href="signup.html" class="cta-button">Sign Up Now</a>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p class="footer-text">&copy; 2024 CRM System. All rights reserved.</p>
            <ul class="footer-links">
                <li><a href="#privacy-policy">Privacy Policy</a></li>
                <li><a href="#terms-of-service">Terms of Service</a></li>
                <li><a href="#contact">Contact Us</a></li>
            </ul>
        </div>
    </footer>
</body>
  `);

  const [cssInput, setCssInput] = useState(`
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
    footer {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
    }
  `);

  const [sanitizedHTML, setSanitizedHTML] = useState(
    DOMPurify.sanitize(htmlInput)
  );

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = cssInput;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [cssInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSanitizedHTML(DOMPurify.sanitize(htmlInput));
  };

  return (
    <main className="main">
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="html">HTML:</label>
          <textarea
            id="html"
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows="10"
            cols="50"
          />
        </div>
        <div>
          <label htmlFor="css">CSS:</label>
          <textarea
            id="css"
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            rows="10"
            cols="50"
          />
        </div>
        <button type="submit">Render</button>
      </form>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    </main>
  );
}

examples = {
    "fun , playful , colorful , bold  personal portfolio website": {
        "html": """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Website</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="logo">MyPortfolio</div>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section id="home" class="hero">
      <h1>Hi, I'm [Your Name]</h1>
      <p>A Creative Designer & Developer</p>
      <a href="#portfolio" class="cta-button">View My Work</a>
    </section>
    <section id="about" class="about">
      <h2>About Me</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel arcu nec orci ultrices dignissim.</p>
    </section>
    <section id="portfolio" class="portfolio">
      <h2>My Work</h2>
      <div class="portfolio-items">
        <div class="portfolio-item">
          <img src="https://via.placeholder.com/300" alt="Project 1">
          <h3>Project 1</h3>
          <p>Description of Project 1</p>
        </div>
        <div class="portfolio-item">
          <img src="https://via.placeholder.com/300" alt="Project 2">
          <h3>Project 2</h3>
          <p>Description of Project 2</p>
        </div>
        <div class="portfolio-item">
          <img src="https://via.placeholder.com/300" alt="Project 3">
          <h3>Project 3</h3>
          <p>Description of Project 3</p>
        </div>
      </div>
    </section>
    <section id="contact" class="contact">
      <h2>Contact Me</h2>
      <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 MyPortfolio. All rights reserved.</p>
  </footer>
</body>
</html>

        """,
        "css": """
:root {
  --primary-color: #f0f4f8;
  --secondary-color: #d6e1e8;
  --accent-color: #EB526E;
  --button-color: #EB526E;
  --button-text-color: #F9F8F5;
  --text-color: #1e2a38;
  --font-family: 'Manrope', sans-serif;
}

/* General styles */
body {
  margin: 0;
  font-family: var(--font-family);
  color: var(--text-color);
  background: var(--primary-color);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--text-color);
}

header .logo {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--primary-color);
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

nav ul li a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 400;
  padding: 0.5rem 1rem;
  border: 2px solid var(--text-color);
  border-radius: 0;
  transition: background 0.3s, color 0.3s;
}

nav ul li a:hover {
  background: var(--button-color);
  color: var(--button-text-color);
}

/* Hero section */
.hero {
  text-align: center;
  padding: 25vh 2rem;
  color: var(--text-color);
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 1rem;
}

.hero p {
  font-size: 1.5rem;
  margin: 0 0 2rem;
}

.cta-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--button-color);
  color: var(--button-text-color);
  text-decoration: none;
  border: 3px solid var(--text-color);
  border-radius: 0;
  font-weight: 600;
  transition: background 0.3s, color 0.3s;
}

.cta-button:hover {
  background: var(--text-color);
  color: var(--button-color);
}

/* About section */
.about {
  padding: 4rem 2rem;
  text-align: center;
  background: var(--secondary-color);
}

.about h2 {
  font-size: 2rem;
  margin: 0 0 1rem;
}

.about p {
  font-size: 1.2rem;
  margin: 0;
}

/* Portfolio section */
.portfolio {
  padding: 4rem 2rem;
  text-align: center;
}

.portfolio h2 {
  font-size: 2rem;
  margin: 0 0 2rem;
}

.portfolio-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.portfolio-item {
  background: var(--secondary-color);
  padding: 1.5rem;
  border: 4px solid var(--text-color);
  border-radius: 0;
  width: 300px;
  text-align: center;
}

.portfolio-item img {
  width: 100%;
  border: 4px solid var(--text-color);
  border-radius: 0;
}

.portfolio-item h3 {
  margin: 1rem 0 0.5rem;
}

.portfolio-item p {
  margin: 0;
}

/* Contact section */
.contact {
  padding: 4rem 2rem;
  text-align: center;
  background: var(--secondary-color);
}

.contact form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 600px;
  margin: 0 auto;
}

.contact label {
  display: block;
  margin-top: 1rem;
  text-align: left;
}

.contact .form-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.contact .form-row input,
.contact .form-row input[type="email"] {
  flex: 1;
}

.contact input,
.contact textarea {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 2px solid var(--text-color);
  border-radius: 0;
  background: var(--primary-color);
  color: var(--text-color);
}

.contact button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border: 3px solid var(--text-color);
  border-radius: 0;
  background: var(--button-color);
  color: var(--button-text-color);
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s, color 0.3s;
}

.contact button:hover {
  background: var(--text-color);
  color: var(--button-color);
}

/* Footer */
footer {
  text-align: center;
  padding: 1rem;
  background: var(--primary-color);
}

        """
    },
    "modern , gradient, gradients , and dark  fintech , crypto, blockchain , tech landing page website": {
        "html": """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Dark Theme Site</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="logo">MySite</div>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>Welcome to MySite</h1>
      <p>Your solution for modern web design</p>
    </section>
    <section class="cards">
      <div class="card">
        <h2>Feature 1</h2>
        <p>Description of feature 1</p>
      </div>
      <div class="card">
        <h2>Feature 2</h2>
        <p>Description of feature 2</p>
      </div>
      <div class="card">
        <h2>Feature 3</h2>
        <p>Description of feature 3</p>
      </div>
    </section>
    <section class="team">
      <h2>Meet Our Team</h2>
      <div class="team-members">
        <div class="team-member">
          <img src="https://via.placeholder.com/150" alt="Team Member">
          <h3>John Doe</h3>
          <p>CEO</p>
        </div>
        <div class="team-member">
          <img src="https://via.placeholder.com/150" alt="Team Member">
          <h3>Jane Smith</h3>
          <p>CTO</p>
        </div>
        <div class="team-member">
          <img src="https://via.placeholder.com/150" alt="Team Member">
          <h3>Emily Johnson</h3>
          <p>Lead Designer</p>
        </div>
      </div>
    </section>
    <section class="testimonials">
      <h2>What Our Clients Say</h2>
      <div class="testimonial">
        <p>"MySite transformed our online presence."</p>
        <p>- Happy Client</p>
      </div>
      <div class="testimonial">
        <p>"Incredible design and great support."</p>
        <p>- Satisfied Customer</p>
      </div>
    </section>
    <section class="contact">
      <h2>Contact Us</h2>
      <div class="contact-card">
        <form>
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
          <label for="message">Message</label>
          <textarea id="message" name="message" required></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 MySite. All rights reserved.</p>
  </footer>
</body>
</html>
        """,
        "css": """
:root {
  --primary-color: #0f0c29;
  --secondary-color: #302b63;
  --accent-color: #24243e;
  --text-color: #fff;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(10px);
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --font-family: 'Inter', sans-serif;
}

/* General styles */
body {
  margin: 0;
  font-family: var(--font-family);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--accent-color));
  color: var(--text-color);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--box-shadow);
}

h2 {
text-align: center;
}

header .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

nav ul li a {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

nav ul li a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Hero section */
.hero {
  text-align: center;
  padding: 8rem 2rem;
  margin: 2rem 1rem;
  border-radius: 10px;
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 1rem;
}

.hero p {
  font-size: 1.5rem;
  margin: 0;
}

/* Cards section */
.cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-10px);
}

.card h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.card p {
  margin: 0;
}

/* Team section */
.team {
  padding: 2rem;
  text-align: center;
}

.team-members {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.team-member {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  border-radius: 10px;
  width: 200px;
  text-align: center;
}

.team-member img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

/* Testimonials section */
testimonials {
  padding: 2rem;
  text-align: center;
  display:flex;
  flex-direction:column;
align-items:center;

}

.testimonial {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  border-radius: 10px;
  margin: 1rem auto;
  width: 60%;
}

/* Contact section */
.contact {
  padding: 2rem;
  text-align: center;
}

.contact-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  border-radius: 10px;
  margin: 0 auto;
  width: 50%;
  text-align: left;
}

.contact form {
  display: flex;
  flex-direction: column;
}

.contact label {
  margin-top: 1rem;
}

.contact input,
.contact textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 5px;
  background: var(--glass-bg);
  color: var(--text-color);
}

.contact button {
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-color);
  cursor: pointer;
  transition: background 0.3s;
}

.contact button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Footer */
footer {
  text-align: center;
  padding: 1rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--box-shadow);
  margin: 2rem 1rem;
  border-radius: 10px;
}
        """
    },
    "light , tech , simple and minimalist landing page website": {
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
:root {
    --color-background: #f5f5f7;
    --color-primary: #007aff;
    --color-secondary: #333;
    --color-text: #1d1d1f;
    --color-white: #ffffff;
    --color-border: #e0e0e0;
    --color-shadow: rgba(0, 0, 0, 0.1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: var(--color-background);
    color: var(--color-text);
}

section {
padding: 1rem;
}

.navbar {
    background-color: var(--color-white);
    padding: 20px;
    box-shadow: 0 1px 3px var(--color-shadow);
    border-bottom: 1px solid var(--color-border);
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar .logo {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-secondary);
}

.navbar nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
}

.navbar nav ul li a {
    color: var(--color-secondary);
    text-decoration: none;
    font-weight: 400;
}

.hero {
    background: linear-gradient(145deg, var(--color-white), var(--color-background));
    color: var(--color-text);
    text-align: center;
    padding: 100px 0;
}

.hero .container {
    max-width: 800px;
    margin: 0 auto;
}

.hero h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
}

.hero p {
    font-size: 18px;
    margin-bottom: 40px;
}

.hero .cta-button {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: 12px 30px;
    text-decoration: none;
    border-radius: 22px;
    font-weight: 600;
}

.features, .testimonials, .contact {
    padding: 80px 0;
    text-align: center;
}

.features .container, .testimonials .container, .contact .container {
  max-width: 800px;display:flex; flex-direction:column;
gap:2rem;
    margin: 0 auto;
}

.feature-list {
    display: flex;
    gap: 1.5rem;
}

.feature {
    background-color: var(--color-white);
    padding: 30px;
    border-radius: 15px;
    width: 30%;
    box-shadow: 0 4px 10px var(--color-shadow);
}

.feature h3 {
    font-size: 24px;
    margin-bottom: 10px;
}

.feature p {
    font-size: 16px;
}

.testimonial-cards {
    display: flex;
    gap: 1.5rem;
}

.testimonial {
    background-color: var(--color-white);
    padding: 30px;
    border-radius: 15px;
    width: 30%;
    box-shadow: 0 4px 10px var(--color-shadow);
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
    gap: 20px;
}

.contact form input, .contact form textarea, .contact form button {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    font-size: 16px;
}

.contact form button {
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.footer {
    background-color: var(--color-background);
    color: var(--color-text);
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid var(--color-border);
}

        """
    }
}
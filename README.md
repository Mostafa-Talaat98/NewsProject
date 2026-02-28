# NewsHub - Premium News Application

NewsHub is a responsive, modern web application that delivers the latest news across various categories, alongside live sports updates and financial alerts. It provides an intuitive, infinite-scroll experience built with vanilla web technologies and Bootstrap 5.

## Features

*   **Categorized News Feeds:** Fetches and displays top stories across multiple dedicated sections:
    *   Breaking News
    *   Politics
    *   Cars (Accidents)
    *   World News
*   **Live Sports Integration:** Real-time scoreboard for top soccer leagues (English Premier League, La Liga, Bundesliga, Serie A, Ligue 1) using the ESPN API.
*   **Dynamic Widgets:** Includes auto-scrolling sidebar widgets for:
    *   💰 Money Alerts
    *   ⚽ Match Updates
*   **Responsive Design:** Fully responsive layout built with Bootstrap 5, providing a seamless experience on desktop, tablet, and mobile devices.
*   **Modern UI:** Clean aesthetic utilizing the Inter font family, card-based layouts, and smooth CSS hover-lift effects.

## Technologies Used

*   **HTML5**
*   **CSS3** (Custom styling + **Bootstrap 5.3.3**)
*   **JavaScript (ES6+)** with dynamic DOM manipulation and asynchronous API fetching.
*   **[NewsAPI](https://newsapi.org/)**: Powers the primary news articles and categorical fetching.
*   **[ESPN Public API](https://site.api.espn.com/)**: Powers the live soccer match results in the sidebar.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Mostafa-Talaat98/NewsProject.git
    cd NewsProject
    ```
2.  **API Key Configuration:**
    The project currently uses a hardcoded NewsAPI key in `main.js`. For extended use or if rate limits are hit, you may need to register at [NewsAPI.org](https://newsapi.org/) and replace the `API_KEY` constant in `main.js` with your own.
3.  **Run the application:**
    Since the application uses standard HTML/JS/CSS, you can simply open the `index.html` file in your preferred web browser, or serve it using a local development server (like VS Code Live Server or Python's `http.server`):
    ```bash
    # Example using Python 3
    python -m http.server 8000
    ```
    Then, navigate to `http://localhost:8000` in your browser.

## Project Structure

*   `index.html`: The main structural file containing the layout, navbar, main article containers, and sidebar widgets.
*   `style.css`: Custom CSS containing styling overrides, the auto-scrolling animation logic, and component-specific aesthetics.
*   `main.js`: Contains all the JavaScript logic for asynchronously fetching data from the NewsAPI and ESPN API, and dynamically rendering the DOM elements.
*   `sportdb_openapi.json`: OpenAPI specification referencing sports data structures.

## License

This project is open-source and available under the MIT License.
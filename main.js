
const API_KEY = 'd5994425403242b88ae9932b6f516057';
const BASE_URL = 'https://newsapi.org/v2/everything';
const FROM_DATE = '2026-01-23'; // User's requested date

document.addEventListener('DOMContentLoaded', () => {
    fetchNewsData();
    fetchLiveMatches();
});

async function fetchNewsData() {
    try {
        // Fetch 4 New Main Sections (Breaking, Politics, Accidents, World)
        // 1. Breaking News
        const breakRes = await fetch(`${BASE_URL}?q="breaking news"&sortBy=publishedAt&pageSize=3&apiKey=${API_KEY}`);
        const breakData = await breakRes.json();
        renderMainNews('breaking-news-container', breakData.articles);

        // 2. Politics
        const polRes = await fetch(`${BASE_URL}?q=politics&sortBy=publishedAt&pageSize=3&apiKey=${API_KEY}`);
        const polData = await polRes.json();
        renderMainNews('politics-news-container', polData.articles);

        // 3. Accidents
        const accRes = await fetch(`${BASE_URL}?q=accidents&sortBy=publishedAt&pageSize=3&apiKey=${API_KEY}`);
        const accData = await accRes.json();
        renderMainNews('accidents-news-container', accData.articles);

        // 4. World News
        const worldRes = await fetch(`${BASE_URL}?q=world&sortBy=publishedAt&pageSize=3&apiKey=${API_KEY}`);
        const worldData = await worldRes.json();
        renderMainNews('world-news-container', worldData.articles);

        // Fetch Money News
        const moneyRes = await fetch(`${BASE_URL}?q=money&sortBy=publishedAt&pageSize=4&apiKey=${API_KEY}`);
        const moneyData = await moneyRes.json();
        renderHorizontalWidget('money-news-list', moneyData.articles);

        // Fetch Matches/Sports News
        const matchesRes = await fetch(`${BASE_URL}?q=match+OR+football+OR+sports&sortBy=publishedAt&pageSize=4&apiKey=${API_KEY}`);
        const matchesData = await matchesRes.json();

        if (matchesData && matchesData.articles) {
            renderHorizontalWidget('matches-news-list', matchesData.articles);
        } else {
            console.error("News API returned error or no articles");
            document.getElementById('matches-news-list').innerHTML = '<li class="widget-item">Sports news unavailable.</li>';
        }

    } catch (error) {
        console.error("Error fetching news from API:", error);
    }
}

async function fetchLiveMatches() {
    const container = document.getElementById('live-matches-list');
    container.innerHTML = '<div class="text-center text-muted small">Loading matches...</div>';

    try {
        // Fetching live/recent matches from multiple public APIs (ESPN scoreboards)
        const leagues = [
            'eng.1', // English Premier League
            'esp.1', // Spanish La Liga
            'ger.1', // German Bundesliga
            'ita.1', // Italian Serie A
            'fra.1'  // French Ligue 1
        ];

        const fetchPromises = leagues.map(league =>
            fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        );

        const responses = await Promise.all(fetchPromises);
        let allEvents = [];

        responses.forEach(data => {
            if (data && data.events && data.events.length > 0) {
                // Attach league name to each event for easier rendering
                const leagueName = data.leagues && data.leagues[0] ? data.leagues[0].name : "Soccer";
                data.events.forEach(event => {
                    event.customLeagueName = leagueName;
                    allEvents.push(event);
                });
            }
        });

        container.innerHTML = '';

        if (allEvents.length === 0) {
            container.innerHTML = '<div class="text-center text-muted small">No live matches right now.</div>';
            return;
        }

        // Sort events to prioritize live matches (status.type.state === 'in')
        allEvents.sort((a, b) => {
            const isALive = a.status.type.state === 'in' ? 1 : 0;
            const isBLive = b.status.type.state === 'in' ? 1 : 0;
            return isBLive - isALive;
        });

        // Limit to top 5 matches
        const eventsToDisplay = allEvents.slice(0, 5);

        eventsToDisplay.forEach(event => {
            try {
                const comp = event.competitions[0];
                const home = comp.competitors.find(c => c.homeAway === 'home');
                const away = comp.competitors.find(c => c.homeAway === 'away');

                const league = event.customLeagueName;
                const homeTeam = home.team.shortDisplayName || home.team.name;
                const awayTeam = away.team.shortDisplayName || away.team.name;
                const homeScore = home.score || "0";
                const awayScore = away.score || "0";
                const time = event.status.type.shortDetail || "FT";

                const matchHTML = `
                    <div class="live-match-card">
                        <span class="match-league">${league}</span>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="match-team text-end" style="flex:1;">${homeTeam}</span>
                            <div class="d-flex flex-column align-items-center mx-3" style="flex:0.5;">
                                <span class="match-score mb-1">${homeScore} - ${awayScore}</span>
                                <span class="match-time">${time}</span>
                            </div>
                            <span class="match-team text-start" style="flex:1;">${awayTeam}</span>
                        </div>
                    </div>
                `;
                container.innerHTML += matchHTML;
            } catch (err) {
                console.error("Error parsing match event:", err);
            }
        });
    } catch (error) {
        console.error("Error fetching live matches:", error);
        container.innerHTML = '<div class="text-center text-danger small">Error loading matches.</div>';
    }
}

function renderMainNews(containerId, articles) {
    const newsContainer = document.getElementById(containerId);
    if (!newsContainer) return;
    newsContainer.innerHTML = '';

    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<p class="text-center w-100">No news articles available at the moment.</p>';
        return;
    }

    // Limit to 3 articles explicitly for a clean 3-column row per section
    const topArticles = articles.slice(0, 3);

    topArticles.forEach(article => {
        // Fallback image if urlToImage is missing
        const image = article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600&h=400';
        const title = article.title || 'Breaking News';
        const excerpt = article.description ? (article.description.length > 100 ? article.description.substring(0, 100) + '...' : article.description) : 'Read more about this exciting update...';

        const cardHTML = `
            <div class="col-md-12 col-lg-12 col-xl-4 mb-4" style="flex: 1 1 30%;">
                <div class="card shadow-sm news-card h-100">
                    <img src="${image}" class="card-img-top" alt="News Image" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600&h=400';">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text flex-grow-1">${excerpt}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-outline-primary mt-3 w-100 mt-auto fw-medium rounded-pill">Read More &rarr;</a>
                    </div>
                </div>
            </div>
        `;
        newsContainer.innerHTML += cardHTML;
    });
}

function renderHorizontalWidget(containerId, articles) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="text-center text-muted">No updates found.</div>';
        return;
    }

    const topArticles = articles.slice(0, 4);

    // Create the HTML for the articles
    let itemsHTML = '';
    topArticles.forEach(article => {
        const title = article.title || 'Sports Update';
        const image = article.urlToImage || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=300&h=200';
        const sourceName = article.source?.name || "Sports News";

        itemsHTML += `
            <div class="card mb-3 border-0 shadow-sm matches-widget-card" style="background-color: #fafafa; border-radius: 8px; overflow: hidden; transition: transform 0.2s;">
                <div class="row g-0 flex-row-reverse h-100">
                    <div class="col-5">
                        <img src="${image}" class="img-fluid h-100 w-100 object-fit-cover" alt="Match Image" onerror="this.src='https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=300&h=200';" style="min-height: 120px;">
                    </div>
                    <div class="col-7">
                        <div class="card-body p-3 text-end d-flex flex-column justify-content-center h-100" dir="rtl">
                            <span class="d-inline-block text-warning fw-bold mb-2 small pe-2" style="border-right: 3px solid #ffaa00;">${sourceName}</span>
                            <a href="${article.url}" target="_blank" class="text-dark text-decoration-none fw-bold" style="font-size: 0.95rem; line-height: 1.5;">${title}</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Wrap the items in a scrolling wrapper and duplicate the items to create a seamless infinite scroll effect
    const finalHTML = `
        <div class="scrolling-news-wrapper">
            ${itemsHTML}
            ${itemsHTML}  <!-- Duplicated for seamless vertical scroll loop -->
        </div>
    `;

    container.innerHTML = finalHTML;
}

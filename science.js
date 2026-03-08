const API_KEY = '150dda084c057317b24360129faaa015';
const BASE_URL = 'https://gnews.io/api/v4/search';

document.addEventListener('DOMContentLoaded', () => {
    fetchScienceNews();
});

async function fetchScienceNews() {
    const container = document.getElementById('science-news-container');

    try {
        const res = await fetch(`${BASE_URL}?q=science+OR+health+OR+medicine&lang=en&max=12&apikey=${API_KEY}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        container.innerHTML = '';

        if (!data.articles || data.articles.length === 0) {
            container.innerHTML = '<p class="text-center w-100 py-5">No science and health news available at the moment.</p>';
            return;
        }

        data.articles.forEach(article => {
            const image = article.image || article.urlToImage || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600&h=400';
            const title = article.title || 'Science & Health Update';
            const excerpt = article.description ? (article.description.length > 120 ? article.description.substring(0, 120) + '...' : article.description) : 'Read more about this exciting science and health update...';
            const source = article.source?.name || 'News Source';

            const cardHTML = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card shadow-sm news-card h-100">
                        <div class="position-relative">
                            <span class="badge bg-primary position-absolute top-0 end-0 m-3 z-1">${source}</span>
                            <img src="${image}" class="card-img-top" alt="News Image" onerror="this.src='https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600&h=400';">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold">${title}</h5>
                            <p class="card-text flex-grow-1 text-muted">${excerpt}</p>
                            <a href="${article.url}" target="_blank" class="btn btn-outline-primary mt-3 w-100 mt-auto fw-medium rounded-pill">Read Article &rarr;</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Error fetching science news:", error);
        container.innerHTML = `
            <div class="alert alert-danger text-center w-100 py-4" role="alert">
                An error occurred while loading the news. Please try again later.
            </div>
        `;
    }
}

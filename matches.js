document.addEventListener('DOMContentLoaded', () => {
    fetchAllMatches();
    setupFilters();
});

function setupFilters() {
    const leagueFilter = document.getElementById('league-filter-select');
    if (!leagueFilter) return;

    const filterMatches = () => {
        const selectedLeague = leagueFilter.value.toLowerCase();

        const leagueSections = document.querySelectorAll('.league-section');
        let totalVisibleMatches = 0;

        leagueSections.forEach(section => {
            const leagueTitle = section.querySelector('.league-title').textContent.toLowerCase();
            const matchRows = section.querySelectorAll('.match-row');
            let hasVisibleMatch = false;

            const matchesLeaguePattern = selectedLeague === "" || leagueTitle.includes(selectedLeague);

            if (matchesLeaguePattern) {
                matchRows.forEach(row => {
                    row.classList.remove('d-none');
                    row.classList.add('d-flex');
                    hasVisibleMatch = true;
                    totalVisibleMatches++;
                });
            } else {
                matchRows.forEach(row => {
                    row.classList.remove('d-flex');
                    row.classList.add('d-none');
                });
            }

            if (hasVisibleMatch) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });

        let noResultsMsg = document.getElementById('no-filter-results');
        if (totalVisibleMatches === 0 && selectedLeague !== '' && document.querySelector('.league-section')) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-filter-results';
                noResultsMsg.className = 'alert alert-warning text-center py-4 mt-4 shadow-sm';
                noResultsMsg.innerHTML = '<h5 class="alert-heading fw-bold mb-2">No Matches Found</h5><p class="mb-0">No matches match your filter criteria. Try a different league.</p>';
                document.getElementById('all-matches-container').appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    };

    leagueFilter.addEventListener('change', filterMatches);
}

async function fetchAllMatches() {
    const container = document.getElementById('all-matches-container');

    // Focus on the most popular leagues available in ESPN API
    const leagues = [
        'eng.1', // English Premier League
        'esp.1', // Spanish La Liga
        'ger.1', // German Bundesliga
        'ita.1', // Italian Serie A
        'fra.1', // French Ligue 1
        'uefa.champions', // UEFA Champions League
        'uefa.europa' // UEFA Europa League
    ];

    try {
        const fetchPromises = leagues.map(league =>
            fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        );

        const responses = await Promise.all(fetchPromises);
        container.innerHTML = ''; // Clear the loading spinner

        let hasMatches = false;
        const availableLeagues = [];

        responses.forEach(data => {
            if (data && data.events && data.events.length > 0) {
                hasMatches = true;
                const leagueName = data.leagues && data.leagues[0] ? data.leagues[0].name : "Soccer League";
                const season = data.leagues && data.leagues[0] ? data.leagues[0].season.year : "";

                if (!availableLeagues.includes(leagueName)) {
                    availableLeagues.push(leagueName);
                }

                let leagueHTML = `
                    <div class="league-section">
                        <h3 class="league-title d-flex justify-content-between align-items-center">
                            <span>${leagueName} <span class="text-muted fs-6 ms-2 pb-1">${season}</span></span>
                            <span class="badge bg-secondary rounded-pill">${data.events.length}</span>
                        </h3>
                        <div class="match-list">
                `;

                data.events.forEach(event => {
                    const comp = event.competitions[0];
                    const home = comp.competitors.find(c => c.homeAway === 'home');
                    const away = comp.competitors.find(c => c.homeAway === 'away');

                    const homeTeam = home.team.shortDisplayName || home.team.name;
                    const homeLogo = home.team.logo || '';
                    const awayTeam = away.team.shortDisplayName || away.team.name;
                    const awayLogo = away.team.logo || '';

                    const homeScore = home.score || "0";
                    const awayScore = away.score || "0";

                    const timeStatus = event.status.type.shortDetail || "FT";
                    const state = event.status.type.state; // 'pre', 'in', 'post'

                    const statusClass = state === 'in' ? 'status-live fw-bold' : 'match-status';

                    leagueHTML += `
                        <div class="match-row d-flex align-items-center justify-content-between">
                            <!-- Home Team -->
                            <div class="d-flex align-items-center justify-content-end" style="flex: 1;">
                                <span class="team-name me-3 text-end">${homeTeam}</span>
                                ${homeLogo ? `<img src="${homeLogo}" alt="${homeTeam}" width="30" height="30" style="object-fit: contain;">` : '<div style="width:30px"></div>'}
                            </div>
                            
                            <!-- Score/Time -->
                            <div class="d-flex flex-column align-items-center px-4" style="flex: 0.5;">
                                ${state === 'pre' ?
                            `<span class="match-status mb-1">${timeStatus}</span>
                                     <span class="text-muted fw-bold">v</span>`
                            :
                            `<div class="score-box mb-1">${homeScore} - ${awayScore}</div>
                                     <span class="${statusClass}">${timeStatus}</span>`
                        }
                            </div>
                            
                            <!-- Away Team -->
                            <div class="d-flex align-items-center justify-content-start" style="flex: 1;">
                                ${awayLogo ? `<img src="${awayLogo}" alt="${awayTeam}" width="30" height="30" style="object-fit: contain;" class="me-3">` : '<div style="width:30px" class="me-3"></div>'}
                                <span class="team-name text-start">${awayTeam}</span>
                            </div>
                        </div>
                    `;
                });

                leagueHTML += `
                        </div>
                    </div>
                `;

                container.innerHTML += leagueHTML;
            }
        });

        if (hasMatches) {
            const leagueFilter = document.getElementById('league-filter-select');
            if (leagueFilter) {
                availableLeagues.forEach(league => {
                    const option = document.createElement('option');
                    option.value = league.toLowerCase();
                    option.textContent = league;
                    leagueFilter.appendChild(option);
                });
            }
        }

        if (!hasMatches) {
            container.innerHTML = `
                <div class="alert alert-info text-center py-4" role="alert">
                    <h4 class="alert-heading">No Matches Found</h4>
                    <p class="mb-0">There are currently no live or recent matches available for the major leagues today.</p>
                </div>
            `;
        }

    } catch (error) {
        console.error("Error fetching all matches:", error);
        container.innerHTML = `
            <div class="alert alert-danger text-center py-4" role="alert">
                An error occurred while loading the match data. Please try again later.
            </div>
        `;
    }
}

// Elements
const navbar = document.getElementById('navbar');
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
const searchBox = document.querySelector('.search-box');
const mainContent = document.getElementById('mainContent');
const searchResults = document.getElementById('searchResults');
const searchGrid = document.getElementById('searchGrid');
const loader = document.getElementById('loader');

const playerModal = document.getElementById('playerModal');
const closeModalBtn = document.getElementById('closeModal');
const videoPlayer = document.getElementById('videoPlayer');

let currentSearchTitle = '';

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Search Box Expand
searchIcon.addEventListener('click', () => {
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
        searchInput.focus();
    }
});

// Data for Rows (Using TMDB Links + Proxy)
const trendingMovies = [
    { id: 299534, title: 'Avengers: Endgame', image: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
    { id: 76600, title: 'Avatar: The Way of Water', image: 'https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: 634649, title: 'Spider-Man: No Way Home', image: 'https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' },
    { id: 872585, title: 'Oppenheimer', image: 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
    { id: 603692, title: 'John Wick: Chapter 4', image: 'https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: 502356, title: 'The Super Mario Bros. Movie', image: 'https://image.tmdb.org/t/p/original/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg' },
    { id: 615656, title: 'Meg 2: The Trench', image: 'https://image.tmdb.org/t/p/original/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg' },
    { id: 385687, title: 'Fast X', image: 'https://image.tmdb.org/t/p/original/fiVW06jE7z9YnO4trhaMEdclSiC.jpg' }
];

const actionMovies = [
    { id: 155, title: 'The Dark Knight', image: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: 24428, title: 'The Avengers', image: 'https://image.tmdb.org/t/p/original/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg' },
    { id: 557, title: 'Spider-Man', image: 'https://image.tmdb.org/t/p/original/kjdJntyBeEvqm9w97QGBdxPptzj.jpg' },
    { id: 1726, title: 'Iron Man', image: 'https://image.tmdb.org/t/p/original/4SdlLIkUQYylkgivWRlSqIHhasy.jpg' },
    { id: 634649, title: 'Spider-Man: No Way Home', image: 'https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' },
    { id: 299534, title: 'Avengers: Endgame', image: 'https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
    { id: 603692, title: 'John Wick: Chapter 4', image: 'https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: 872585, title: 'Oppenheimer', image: 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' }
];

const scifiMovies = [
    { id: 27205, title: 'Inception', image: 'https://image.tmdb.org/t/p/original/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
    { id: 157336, title: 'Interstellar', image: 'https://image.tmdb.org/t/p/original/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg' },
    { id: 603, title: 'The Matrix', image: 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: 330457, title: 'Frozen II', image: 'https://image.tmdb.org/t/p/original/mINJaa34MtknCYl5AjtNJzWj8cD.jpg' },
    { id: 76600, title: 'Avatar 2', image: 'https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: 436270, title: 'Black Adam', image: 'https://image.tmdb.org/t/p/original/rCtreCr4xiYEWDQTebybolIh6Xe.jpg' },
    { id: 640146, title: 'Ant-Man and the Wasp: Quantumania', image: 'https://image.tmdb.org/t/p/original/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg' },
    { id: 505642, title: 'Black Panther: Wakanda Forever', image: 'https://image.tmdb.org/t/p/original/sv1xJUazXeYqALzczSZ3O6nkH75.jpg' }
];

function init() {
    renderRow('trendingRow', trendingMovies);
    renderRow('actionRow', actionMovies);
    renderRow('scifiRow', scifiMovies);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    closeModalBtn.addEventListener('click', closePlayer);
}

// Helper to Proxy Images for Indian ISPs
function getProxiedImage(url) {
    if (!url) return 'https://via.placeholder.com/300x450?text=No+Poster';

    // OPTIMIZATION: Convert massive 4K "original" posters to tiny "w300" thumbnails for instant loading
    url = url.replace('/original/', '/w300/');

    if (url.includes('image.tmdb.org')) {
        return url.replace('https://image.tmdb.org/', 'https://wsrv.nl/?url=image.tmdb.org/');
    }
    return url;
}

function renderRow(elementId, movies) {
    const row = document.getElementById(elementId);
    row.innerHTML = '';
    movies.forEach(movie => {
        const img = document.createElement('img');
        img.className = 'row-poster';
        img.loading = 'lazy'; // OPTIMIZATION: Lazy load images
        // For rows we can use w300 or w500 to save bandwidth, but we'll proxy original
        let imgUrl = getProxiedImage(movie.image);
        img.src = imgUrl;
        img.alt = movie.title;
        img.onerror = function() { this.src='https://via.placeholder.com/300x170?text=Error'; };
        img.onclick = () => openPlayer(movie.id, movie.title);
        row.appendChild(img);
    });

    // Add scroll logic to handles
    const rowContainer = row.parentElement;
    const leftHandle = rowContainer.querySelector('.left-handle');
    const rightHandle = rowContainer.querySelector('.right-handle');

    if (leftHandle && rightHandle) {
        leftHandle.addEventListener('click', () => {
            row.scrollBy({ left: -window.innerWidth / 2, behavior: 'smooth' });
        });
        rightHandle.addEventListener('click', () => {
            row.scrollBy({ left: window.innerWidth / 2, behavior: 'smooth' });
        });
    }
}

// Navigation Category Logic
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.innerText;
        const rowsContainer = document.getElementById('rowsContainer');

        // Simple filtering simulation
        if (category === 'TV Shows') {
            document.getElementById('trendingRow').parentElement.parentElement.style.display = 'none';
            document.getElementById('actionRow').parentElement.parentElement.style.display = 'block';
            document.getElementById('scifiRow').parentElement.parentElement.style.display = 'none';
        } else if (category === 'Movies') {
            document.getElementById('trendingRow').parentElement.parentElement.style.display = 'block';
            document.getElementById('actionRow').parentElement.parentElement.style.display = 'block';
            document.getElementById('scifiRow').parentElement.parentElement.style.display = 'block';
        } else if (category === 'My List') {
            rowsContainer.innerHTML = '<h2 class="row-title" style="margin-top:2rem">Your list is empty.</h2>';
        } else {
            // Home
            document.getElementById('trendingRow').parentElement.parentElement.style.display = 'block';
            document.getElementById('actionRow').parentElement.parentElement.style.display = 'block';
            document.getElementById('scifiRow').parentElement.parentElement.style.display = 'block';
        }
    });
});

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        mainContent.style.display = 'block';
        searchResults.style.display = 'none';
        return;
    }

    mainContent.style.display = 'none';
    searchResults.style.display = 'block';
    searchGrid.innerHTML = '';
    loader.style.display = 'flex';

    try {
        const TMDB_API_KEY = 'cd0567a2102d35281755843b49c18308'; // your actual key
        const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

        // Use corsproxy.io instead
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(tmdbUrl)}`);
        const data = await response.json();

        const movies = data.results;
        loader.style.display = 'none';

        if (movies.length === 0) {
            searchGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted); font-size: 1.2rem;">No results found.</p>';
            return;
        }

        const formattedMovies = movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            image: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '',
            releaseDate: movie.release_date,
            rating: movie.vote_average
        }));

        renderSearchGrid(formattedMovies);
    } catch (err) {
        loader.style.display = 'none';
        searchGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--netflix-red);">Connection error. Please try again.</p>';
        console.error(err);
    }
}

function renderSearchGrid(movies) {
    searchGrid.innerHTML = '';
    movies.forEach(movie => {
        const imgUrl = getProxiedImage(movie.image);

        const wrapper = document.createElement('div');
        wrapper.className = 'grid-item';

        const card = document.createElement('img');
        card.className = 'grid-poster';
        card.loading = 'lazy'; // OPTIMIZATION: Lazy load images
        card.src = imgUrl;
        card.alt = movie.title;
        card.onerror = function() { this.src='https://via.placeholder.com/300x450?text=No+Poster'; };

        wrapper.appendChild(card);

        // Smart detection for Unreleased/Upcoming movies
        const currentYear = new Date().getFullYear();
        const releaseYear = movie.releaseDate ? parseInt(movie.releaseDate.substring(0, 4)) : 9999;
        // If the release year is in the future, OR if it's this year but has a 0 rating (nobody has watched/rated it yet)
        const isUpcoming = (releaseYear > currentYear) || (releaseYear >= currentYear && movie.rating === 0);

        if (isUpcoming) {
            const label = document.createElement('div');
            label.className = 'upcoming-label';
            label.textContent = 'Upcoming';
            wrapper.appendChild(label);
        }

        wrapper.onclick = () => {
            if (isUpcoming) {
                alert(`"${movie.title}" is an UPCOMING movie that has not been released yet.\n\nThere are no streaming sources available!`);
            } else {
                openPlayer(movie.id, movie.title);
            }
        };

        searchGrid.appendChild(wrapper);
    });
}

let currentPlayingId = null;

// Hot-swap server logic
document.getElementById('serverSelect').addEventListener('change', (e) => {
    if (currentPlayingId) {
        openPlayer(currentPlayingId, currentSearchTitle); // Instantly swap iframe on change
    }
});

function openPlayer(tmdbId, title) {
    currentPlayingId = tmdbId;
    currentSearchTitle = title;

    const server = document.getElementById('serverSelect').value;
    const container = document.querySelector('.video-container');

    let iframeSrc = '';
    if (server === 'autoembed') {
        iframeSrc = `https://autoembed.co/movie/tmdb/${tmdbId}`;
    } else if (server === '2embed') {
        iframeSrc = `https://www.2embed.cc/embed/${tmdbId}`;
    } else if (server === 'vidlink') {
        iframeSrc = `https://vidlink.pro/movie/${tmdbId}`;
    } else if (server === 'smashy') {
        iframeSrc = `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;
    } else if (server === 'vidsrc') {
        iframeSrc = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
    }

    // Removed the sandbox attribute. SmashyStream requires a fully permissive iframe to load its video blobs and cross-origin scripts!
    container.innerHTML = `<iframe src="${iframeSrc}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" allow="autoplay; fullscreen"></iframe>`;

    // Fallback button opens current server in a new tab
    const fullscreenBtn = document.getElementById('externalFullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.onclick = () => window.open(iframeSrc, '_blank');
    }

    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    playerModal.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
        // Destroy iframe to stop audio instantly
        document.querySelector('.video-container').innerHTML = '';
    }, 300);
}

function openDownload() {
    window.open('https://vegamovies.is/?s=' + encodeURIComponent(currentSearchTitle), '_blank');
}

// Start
init();
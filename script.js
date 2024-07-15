const debounceTimeout = 300;
let searchDebounce;
const placeholderImage = 'https://via.placeholder.com/150';
const TMDB_API_KEY = 'd65eadc037dc441223d81996a5c3b188';
const OMDB_API_KEY = '41b84c2';

function createMovieElement(title, poster) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const posterUrl = (poster !== 'N/A' && poster !== undefined) ? poster : placeholderImage;

    const posterContainer = document.createElement('div');
    posterContainer.classList.add('poster-container');
    posterContainer.innerHTML = `
        <img src="${posterUrl}" alt="${title}" onerror="this.onerror=null;this.src='${placeholderImage}';">
    `;

    const titleElement = document.createElement('p');
    titleElement.textContent = title;

    movieElement.appendChild(posterContainer);
    movieElement.appendChild(titleElement);

    document.getElementById('movies-container').appendChild(movieElement);
}

function fetchMovieDetails(searchTerm) {
    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${OMDB_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                clearMovies();
                data.Search.forEach(movie => createMovieElement(movie.Title, movie.Poster));
            }
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function fetchTrendingMovies() {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                clearMovies();
                data.results.forEach(movie => {
                    const title = movie.title || movie.name;
                    const posterPath = movie.poster_path?`https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage;
                    createMovieElement(title, posterPath);
                });
            }
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

function clearMovies() {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
}

function handleSearchInput(event) {
    clearTimeout(searchDebounce);
    const searchTerm = event.target.value.trim();

    if (searchTerm==='') {
        fetchTrendingMovies();
    } else {
        searchDebounce = setTimeout(() => {
            clearMovies();
            fetchMovieDetails(searchTerm);
        }, debounceTimeout);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
    document.getElementById('search-bar').addEventListener('input', handleSearchInput);
});
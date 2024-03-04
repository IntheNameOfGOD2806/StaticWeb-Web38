import { sidebar } from './sidebar.js';
import { imageBaseUrl } from './api.js';
let currentPage = 1;
const genreName = window.localStorage.getItem("genre");
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjU5NTkzMzMxZTYyNzU0ZGQ0ZjcyNzNhMTdiNTMxMCIsInN1YiI6IjY1ZTMwZTBjMjc4ZDhhMDE2MmJkYjMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7epK2n6iIQA_DN6qNidrFmz6bTw_svihgFNBi7f61E'
    }
};
const fetchDataFromServer = (url, callback, options) => {
    fetch(url, options)
        .then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.log(err))
}
const genreList = []

// fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?language=en`, ({ genres }) => {
//     for (const { id, name } of genres) {
//         genreList.push({ id, name })
//     }
// }, options).then(() => {
//     console.log(genreList)
// })
var genreId = fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options).then(res => res.json()).then(data => {
    for (const { id, name } of data.genres) {
        genreList.push({ id, name })
    }
}).then(() => {
    return (genreList.find((genre) => genre.name == genreName).id)

})


sidebar()


const createMovieList = (movieList, title) => {
    console.log(movieList)
    const movieListElement = document.querySelector(".movie-list.genre-list .grid-list");
    const SectionTitle = document.querySelector(".title-wrapper .heading");
    SectionTitle.textContent = title
    movieListElement.innerHTML += movieList.map((movie) => {
        return (
            `
            <div class="movie-card">
            <figure class="poster-box card-banner">
                <img src=" ${imageBaseUrl}w1280${movie?.backdrop_path}"
                    class="img-cover" alt>
            </figure>
            <h4 class="title">
                ${movie?.title}
            </h4>
            <div class="meta-list">
                <div class="meta-item">
                    <div
                        style="display: flex;align-items: center;">
                        <img src="./assets/images/star.png"
                            width="24" height="24"
                            loading="lazy"
                            alt="rating">
                        <span class="card-badge"> ${(movie?.vote_average.toFixed(1))}</span>
                    </div>
                    <span
                        style="position: absolute;right: 0px;bottom: 0px;"> ${movie?.release_date.slice(0, 4)}</span>
                </div>
              
            </div>
            <a href="./detail.html" class="card-btn" onclick="getMovieDetail(${movie?.id})"
                title="movie title"></a>
        </div>
            `
        )
    }).join("")
    currentPage += 1
}
// homepage section data fetching
fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${await genreId}&page= ${currentPage}`, ({ results }) => {
    createMovieList(results, `${genreName}`);
}, options)


//scrooll event
let lastKnownScrollPosition = 0;
let ticking = false;

async function doSomething(scrollPos) {
    // Do something with the scroll position
      console.log("check scrollPos:", scrollPos)
      console.log("check body scroll height:", document.body.scrollHeight)
    if (scrollPos >= document.body.scrollHeight-800) {
        console.log("check currentPage:", currentPage)

        const id = await genreId;
        fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}&page= ${currentPage}`, ({ results }) => {

            createMovieList(results, `${genreName}`);
        }, options)
    }
}

document.addEventListener("scroll", (event) => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            doSomething(lastKnownScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
});

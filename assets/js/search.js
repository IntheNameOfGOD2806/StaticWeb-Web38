import { imageBaseUrl } from './api.js';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjU5NTkzMzMxZTYyNzU0ZGQ0ZjcyNzNhMTdiNTMxMCIsInN1YiI6IjY1ZTMwZTBjMjc4ZDhhMDE2MmJkYjMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7epK2n6iIQA_DN6qNidrFmz6bTw_svihgFNBi7f61E'
    }
};


export const searchresult = () => {
    const searchModal = document.querySelector(".search-modal");
    const seearchSection = document.querySelector(".search-modal .movie-list .grid-list");
    const searchField = document.querySelector(".search-box .search-field")
    console.log(searchField)
    const searchWrapper = document.querySelector(".search-wrapper")
    let searchTimeout;
    searchField.addEventListener("input", (event) => {
        if (!searchField.value.trim()) {
            searchModal.classList.remove("active")
            searchWrapper.classList.remove("searching")
            clearTimeout(searchTimeout)
            return;
        }
        searchModal.classList.add("active")
        searchWrapper.classList.add("searching")
        clearTimeout(searchTimeout)
        //
        searchTimeout = setTimeout(() => {
            fetch(`https://api.themoviedb.org/3/search/movie?query=${searchField.value.trim()}&include_adult=false&language=en-US&page=1`, options)
                .then(response => response.json())
                .then(response => {
                   
                    seearchSection.innerHTML =response.results.map(movie => {
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

                })
                .catch(err => console.error(err));
        }, 500)
    }
    )
}


"use strict"
// alert("helloffff")
import { sidebar } from './sidebar.js';
import { imageBaseUrl } from './api.js';
//
const fetchDataFromServer = (url, callback, options) => {
    fetch(url, options)
        .then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.log(err))
}
const genreList = []
fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?language=en`, ({ genres }) => {
    for (const { id, name } of genres) {
        genreList.push({ id, name })
    }
})
const getGenreListByIds = (ids) => {
    let result = ""
    result = genreList.filter(({ id }) => ids.includes(id)).map(({ name }) => name).join(", ")
    return result
}
const getVideos = (videoList) => {
    return videoList.filter(({ type, site }) => {
        return (type === "Trailer" || type === "Teaser") && site === "YouTube"
    })
}

const movieId = window.localStorage.getItem("movieId");


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjU5NTkzMzMxZTYyNzU0ZGQ0ZjcyNzNhMTdiNTMxMCIsInN1YiI6IjY1ZTMwZTBjMjc4ZDhhMDE2MmJkYjMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7epK2n6iIQA_DN6qNidrFmz6bTw_svihgFNBi7f61E'
    }
};
//get movie detail
fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=casts,videos,images,releases`, (response) => {

    const { title,
        overview, backdrop_path, popularity, runtime,
        poster_path, vote_average, release_date,
        genres,
        releases: { countries: [{ certification }] },
        casts: { cast, crew },
        videos: { results: videos }
    } = response
    const pageContent = document.querySelector('[page-content]');
    pageContent.querySelector(".movie-detail").innerHTML = `
<div class="backdrop-image"
style="background-image: url( ${imageBaseUrl}w1280${backdrop_path});"></div>
<figure class="poster-box movie-poster">
<img src=" ${imageBaseUrl}w342${poster_path}"
    class="img-cover" alt>
</figure>
<div class="detail-box">
<div class="detail-content">
    <h1 class="heading"> ${title}</h1>
    <div class="meta-list">
        <div class="meta-item">
            <img src="./assets/images/star.png" width="24"
                height="24" alt="rating">
            <span class="span"> ${vote_average.toFixed(1)}</span>

        </div>
        <div class="separator"></div>
        <div class="meta-item"> ${runtime}m </div>
        <div class="separator"></div>
        <div class="meta-item"> ${release_date.slice(0, 4)}</div>
        <div class="meta-item card-badge">${certification}</div>
    </div>
    <p class="genre"> ${getGenreListByIds(genres)}</p>
    <p class="overview">
       ${overview}

    </p>
    <ul class="detail-list">
        <div class="list-item">
            <p class="list-name">Starring</p>
            <p>${cast.map(({ name }) => name).join(", ") || "N/A"}</p>
        </div>
        <div class="list-item">
            <p class="list-name">Directed By</p>
            <p>${crew.map(({ name, job }) => { if (job === "Director") return name }).join(" ") || "N/A"}</p>
        </div>

    </ul>
</div>
<div class="title-wrapper">
    <h3 class="title-large">Trailers and Clips</h3>
</div>
<div class="slider-list">
    <div class="slider-inner">
    ${getVideos(videos).map(({ key, name }) => {
        return (`  <div class="video-card">
    <iframe loading="lazy" class="" width="500" height="294" src=" https://www.youtube.com/embed/${key}" frameborder="0" allowfullscreen=1 title=${name}></iframe>
    </div>`)
    }).join("")}
       

        
    </div>
</div>

</div>
`
}, options)

//get recommendation
fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, (response) => {
    const { results } = response
    const recList = document.querySelector(".movie-list .slider-list .slider-inner")
    recList.innerHTML = results.map(movie => {
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
            <a  class="card-btn" href="./detail.html" onclick="getMovieDetail(${movie?.id})"
                title="movie title"></a>
        </div>
            `
        )
    }).join("")
}, options)


sidebar()
'use strict'
import { fetchDataFromServer, imageBaseUrl } from './api.js';
import { addEventOnElement } from './global-1.js';
import { sidebar } from './sidebar.js';


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjU5NTkzMzMxZTYyNzU0ZGQ0ZjcyNzNhMTdiNTMxMCIsInN1YiI6IjY1ZTMwZTBjMjc4ZDhhMDE2MmJkYjMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7epK2n6iIQA_DN6qNidrFmz6bTw_svihgFNBi7f61E'
    }
};
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
fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, ({ results: movieList }) => {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "popular movies";
    banner.innerHTML = `
    <div class="banner-slider">
</div>
<div class="slider-control">
    <div class="control-inner">
    </div>
</div>
`
    let controlItemIndex = 0;
    for (const [index, movie] of movieList.entries()) {
        const { backdrop_path, title, release_date, genre_ids, overview, poster_path, vote_average, id } = movie;
        const sliderItem = document.createElement('div')
        sliderItem.classList.add('slider-item');
        /////////////////////////////////////
        // index === 0 && sliderItem.classList.add('active');  
        sliderItem.setAttribute("slider-item", '');
        sliderItem.innerHTML = `
        <img src="${imageBaseUrl}w1280${backdrop_path}"
        class="img-cover" alt loading="${index === 0 ? 'eager' : 'lazy'}">
    <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
            <div class="meta-item">${release_date.slice(0, 4)}</div>
            <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${getGenreListByIds(genre_ids)}</p>
        <p class="banner-text">${overview}</p>
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})"5>
            <img src="./assets/images/play_circle.png"
                width="24" height="24" aria-hidden="true"
                alt>
            Watch Now
        </a>
    </div>
        `
        const posterBox = document.createElement('div')
        posterBox.innerHTML = ` <button class="poster-box slider-item slider-control=${controlItemIndex}" >
        <img src="${imageBaseUrl}w1280${backdrop_path}" alt
        loading="lazy" draggable="false"
        class="img-cover">
        </button>`
        posterBox.querySelector('button').setAttribute("slider-control", `${controlItemIndex}`);
        banner.querySelector('.banner-slider').append(sliderItem);
        banner.querySelector('.slider-control .control-inner').append(posterBox);
        controlItemIndex += 1;
        // if (controlItemIndex === 5) controlItemIndex = 0;
        // banner.querySelector('.slider-control .control-inner').children[controlItemIndex].classList.add('active');
    }
    // console.log(banner.innerHTML)
    const pageContent = document.querySelector(".dynamic-section");
    pageContent.appendChild(banner);
    addSlider();
}, options)
sidebar();
//add slider
const addSlider = () => {
    const sliderItems = document.querySelectorAll(' [slider-item]');
    // console.log("sliderItems:", sliderItems)
    const sliderControls = document.querySelectorAll('.poster-box');
    console.log("sliderControls:", sliderControls)
    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];
    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");
    const sliderStart = (sliderControl) => {
        // console.log("check sliderControl:", sliderControl)
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");
        // console.log("check slider:", (sliderControl.getAttribute("slider-control")))
        sliderItems[Number(sliderControl.getAttribute("slider-control"))].classList.add("active")
        sliderControl.classList.add("active");
        lastSliderItem = sliderItems[Number(sliderControl.getAttribute("slider-control"))];
        lastSliderControl = sliderControls[Number(sliderControl.getAttribute("slider-control"))];
    }
    sliderControls.forEach((sliderControl) => {
        sliderControl.addEventListener('click', function () {
            sliderStart(sliderControl); // Using closure to preserve the value of sliderControl
        });
    });
}
const homepageSections = [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming"
    }, {
        title: "Now Playing Movies",
        path: "/movie/now_playing"
    }
    , {
        title: "Top Rated Movies",
        path: "/movie/top_rated"
    }
]
//
const createMovieList = (movieList, title) => {
    const movieListElement = document.createElement("section");
    movieListElement.classList.add("movie-list");
    movieListElement.ariaLabel = title;
    movieListElement.innerHTML = `
                <div class="title-wrapper">
                    <h3 class="title-large">${title}</h3>
                </div>
                <div class="slider-list">
                    <div class="slider-inner">
                    </div>
                </div>
    `
    movieListElement.querySelector(".slider-inner").innerHTML = movieList.map((movie) => {
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
    const pageContent = document.querySelector('[page-content]');
    pageContent.appendChild(movieListElement);
}
// homepage section data fetching
for (const { title, path } of homepageSections) {
    fetchDataFromServer(`https://api.themoviedb.org/3${path}?page=1`, ({ results }) => {
        createMovieList(results, title);
    }, options)
}


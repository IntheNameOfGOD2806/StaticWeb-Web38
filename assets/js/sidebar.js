'use strict'
import { api_key, imageBaseUrl, fetchDataFromServer } from './api.js'
import { addEventOnElement } from './global-1.js';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjU5NTkzMzMxZTYyNzU0ZGQ0ZjcyNzNhMTdiNTMxMCIsInN1YiI6IjY1ZTMwZTBjMjc4ZDhhMDE2MmJkYjMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7epK2n6iIQA_DN6qNidrFmz6bTw_svihgFNBi7f61E'
    }
};
export function sidebar() {
    const genreList = {};
    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?language=en`, ({ genres }) => {
        for (const { id, name } of genres) {
            genreList[id] = name

        }
        // console.log(genres)
        genreLink();
    }, options)

    const sidebarInner = document.createElement('div');
    sidebarInner.classList.add('sidebar-inner');
    sidebarInner.innerHTML = `<div class="sidebar-list">
<p class="title">Genre</p>

</div>
<div class="sidebar-list">
<p class="title">Language</p>
<a href="./movie-list.html"  class="sidebar-link">
    <span>English</span>
</a>
<a href="./movie-list.html" class="sidebar-link">
    <span>Vietnamese</span>
</a>
<a href="./movie-list.html" class="sidebar-link">
    <span>French</span>
</a>

</div>`
    const genreLink = () => {
        for (const [id, name] of Object.entries(genreList)) {
            const link = document.createElement('a');

            link.classList.add('sidebar-link');
            link.setAttribute('href', './movie-list.html');
            link.setAttribute("menu-close", '');
            link.setAttribute("onclick", `getMoviesDetailByGenreId("${name}")`);
            link.textContent = name;
            //beacuse have 2 sidebar-list
            sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link)
        }
        const sidebar = document.querySelector(".sidebar");
        sidebar.innerHTML = sidebarInner.innerHTML + sidebar.innerHTML;
        toggleSidebar(sidebar)
    }
    const toggleSidebar = (sidebar) => {
        const sideBarBtn = document.querySelector("[menu-btn]");
        const sideBarTogglers = document.querySelectorAll("[menu-toggler]")
        const sideBarClose = document.querySelectorAll("[menu-close]")
        const overlay = document.querySelector("[overlay]")
        addEventOnElement(sideBarTogglers, "click", () => {
            document.querySelector(".menu-btn .menu").classList.toggle("active")
            document.querySelector(".menu-btn .close").classList.toggle("active")

            sidebar.classList.toggle("active")
            sideBarBtn.classList.remove("active")
            overlay.classList.remove("active")


        })

    }
}
document.addEventListener('click', (event) => {
    const sidebar = document.querySelector(".sidebar");
    const sideBarBtn = document.querySelector("[menu-btn]");

    const withinBoundaries = event.composedPath().includes(sideBarBtn);

    if (withinBoundaries) {

    } else {
        if (sidebar.classList.contains("active")) sidebar.classList.remove("active")
        if (sidebar.classList.contains("active") && sideBarBtn.classList.contains("active")) {
            sideBarBtn.querySelector(".menu").classList.toggle("active")
            sideBarBtn.querySelector(".close").classList.toggle("active")
        }



    }
})

//   fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));
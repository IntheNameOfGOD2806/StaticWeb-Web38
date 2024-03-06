'use strict'
// 
import { searchresult } from "./search.js";

export function addEventOnElement(elements, eventType, callback){
    for(const element of elements){
        element.addEventListener(eventType, callback)
    }
}
//
const searchBox =document.querySelector("[search-box]");

const searchToggler =document.querySelectorAll("[search-toggler]");
addEventOnElement(searchToggler, "click", ()=>{
   
    searchBox.classList.toggle("active")
})
// store movie id in localstorage when click any movie card
export  const getMovieDetail=function(id){
    window.localStorage.setItem("movieId",String(id))
}

searchresult()

'use strict'
const api_key="af59593331e62754dd4f7273a17b5310"
const imageBaseUrl="https://image.tmdb.org/t/p/";

// fetch data
const fetchDataFromServer=(url,callback,options)=>{
    fetch(url,options)
    .then(res=>res.json())
    .then(data=>callback(data))
    .catch(err=>console.log(err))
}
export {imageBaseUrl,api_key,fetchDataFromServer}
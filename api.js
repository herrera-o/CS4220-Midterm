//Robert Melena

//pulls from axios from node_modules and stores in axios variable to use
const axios = require('axios');

//base url for the api
const url = 'https://openlibrary.org'
//creating asynchronous function to get results via keyword
async function searchByKeyword(keyword){
    const response = await axios.get(`${url}/search.json`,{
        params: {q: keyword, limit: 10}
    });

    //return array of data with specified data (data we want to show)
    return response.data.docs.map(book =>({
        title: book.title,
        author: book.author_name ? book.author_name[0] : 'Unknown',
        id: book.key 
    }));
}

//to search for specific data using unique ID
async function getDetailedById(id){
    const response = await axios.get(`${url}${id}.json`);
    //return a new object representation of the only the data we want to see (keeps cleaner)
    return{
        title: response.data.title,
        description: response.data.description?.value || response.data.description || 'No description available',
        subjects: response.data.subjects ? response.data.subjects.slice(0,5) : []
    }
}

module.exports = {searchByKeyword,getDetailedById};
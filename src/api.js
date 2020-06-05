import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com' // creating the api base url
});

export default api;
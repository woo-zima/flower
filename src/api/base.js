import axios from 'axios';

const instance = axios.create({
  headers: {
    'Access-Control-Allow-Origin-Type': '*',
  },
  baseURL: 'http://localhost:3000/',
  timeout: 20000,
});

export default instance;

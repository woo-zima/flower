import axios from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin-Type': '*',
  },
  baseURL: '',
  timeout: 20000,
});

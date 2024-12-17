import axios from 'axios';

const BASE_URL = 'https://dockercoinport.onrender.com';

const baseurl = axios.create({
  baseURL: BASE_URL,
});

export default baseurl;
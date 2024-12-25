import axios from 'axios';

const BASE_URL = 'http://localhost:5101/';

const baseurl = axios.create({
  baseURL: BASE_URL,
});

export default baseurl;
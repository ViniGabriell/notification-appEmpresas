import axios from 'axios';

const BASE_URL = 'https://apps.blueprojects.com.br/eshows';

export const api = axios.create({
  baseURL: BASE_URL,
});

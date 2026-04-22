import axios from 'axios';

import { apiUrl } from '../domain/apiUrl';

export const httpClient = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

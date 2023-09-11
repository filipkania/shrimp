import axios from "axios";

// export const API_URL = "http://localhost:8787/api";
export const API_URL = "http://0.0.0.0:8787/api";

export const API = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

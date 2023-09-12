import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8787/api";

export const API = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

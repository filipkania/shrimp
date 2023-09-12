import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "https://shrimp.fkania2.workers.dev/api";

export const API = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

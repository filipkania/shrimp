import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8080/";

export const API = axios.create({
  baseURL: API_URL,
  timeout: 5000,

  // TODO: better error handling
  // validateStatus(status) {
  //   return status <= 500;
  // },
});

import wretch from "wretch";

export const API_URL = "http://localhost:8787";

export const queryAPI = (token: string | null = null) =>
  wretch(API_URL)
    .auth(`Bearer ${token}`)
    .errorType("json")
    .resolve((r) => r.json());

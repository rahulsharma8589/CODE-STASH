import axios from "axios";

// This checks: Are we running locally? Use localhost.
// Are we online? Use the relative /api path.
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8800/api" : "/api";

export const api = axios.create({
  baseURL: BASE_URL,
});
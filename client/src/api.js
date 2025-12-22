// import axios from "axios";


// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8800/api" : "/api";

// export const api = axios.create({
//   baseURL: BASE_URL,
// });
import axios from "axios";

// usage of /api lets the proxy handle the destination
const api = axios.create({
  baseURL: "/api",
});

export { api };
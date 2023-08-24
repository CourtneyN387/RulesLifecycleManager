import axios from "axios";

const url = process.env.REACT_APP_BASE_URL;
export const api = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
});

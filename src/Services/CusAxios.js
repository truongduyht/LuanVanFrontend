import axios from "axios";

// Tạo ra phiên bản axios mà theo í của mình
const instance = axios.create({
  baseURL: "http://localhost:8888",
  withCredentials: true,
});

export default instance;

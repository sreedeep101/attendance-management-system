import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// automatically add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});


API.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.data === "Invalid token") {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;

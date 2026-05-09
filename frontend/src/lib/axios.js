import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Helper that resolves once Firebase auth state is determined
function waitForAuth() {
  return new Promise((resolve) => {
    if (auth.currentUser !== undefined) {
      resolve(auth.currentUser);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

api.interceptors.request.use(async (config) => {
  const user = await waitForAuth();
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default api;
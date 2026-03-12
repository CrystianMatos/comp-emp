import axios from "axios";

const API_URL = "http://localhost:3000/api";

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/game/login`, {
        username,
        password,
        server: "br1",
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.player));
        localStorage.setItem("session", JSON.stringify(response.data.session));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkSession() {
    try {
      const response = await axios.get(`${API_URL}/game/check-session`);
      return response.data;
    } catch (error) {
      return { loggedIn: false };
    }
  }

  async logout() {
    try {
      await axios.post(`${API_URL}/game/logout`);
      localStorage.removeItem("user");
      localStorage.removeItem("session");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();

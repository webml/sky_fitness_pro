import { defineStore } from "pinia";
import { API_BASE } from "../utils/consts";

const getInitialToken = () => {
  if (typeof window !== "undefined" && localStorage) {
    return localStorage.getItem("fitnessToken");
  }
  return null;
};

const getInitialUserData = () => {
  if (typeof window !== "undefined" && localStorage) {
    const data = localStorage.getItem("fitnessUser");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const useUserStore = defineStore("user", {
  state: () => ({
    userData: getInitialUserData(),
    token: getInitialToken(),
    isLoading: false,
    error: null,
  }),
  actions: {
    async register(email, password) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Ошибка регистрации");
        }

        this.setToken(data.token);
        await this.fetchUserData();
      } catch (error) {
        this.error = error.message;
        console.error("Ошибка регистрации:", error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async login(email, password) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Ошибка авторизации");
        }

        this.setToken(data.token);
        await this.fetchUserData();
      } catch (error) {
        this.error = error.message;
        console.error("Ошибка входа:", error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserData() {
      if (!this.token) return;

      try {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Ошибка получения данных пользователя"
          );
        }

        this.userData = data;

        // Сохраняем данные пользователя в localStorage
        if (typeof window !== "undefined" && localStorage) {
          localStorage.setItem("fitnessUser", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Ошибка:", error.message);
      }
    },

    setToken(token) {
      this.token = token;
      if (typeof window !== "undefined" && localStorage) {
        localStorage.setItem("fitnessToken", token);
      }
    },

    logout() {
      this.userData = null;
      this.token = null;
      if (typeof window !== "undefined" && localStorage) {
        localStorage.removeItem("fitnessToken");
        localStorage.removeItem("fitnessUser");
      }
    },

    addCourseLocally(courseId) {
      if (
        this.userData?.selectedCourses &&
        !this.userData.selectedCourses.includes(courseId)
      ) {
        this.userData.selectedCourses.push(courseId);
        localStorage.setItem("fitnessUser", JSON.stringify(this.userData));
      }
    },

    removeCourseLocally(courseId) {
      if (this.userData?.selectedCourses) {
        this.userData.selectedCourses = this.userData.selectedCourses.filter(
          (id) => id !== courseId
        );
        localStorage.setItem("fitnessUser", JSON.stringify(this.userData));
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.userData,
  },
});

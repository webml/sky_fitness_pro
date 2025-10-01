import { defineStore } from "pinia";
import { useUserStore } from "../stores/user";
import { useCoursesStore } from "../stores/courses";

export const useWorkoutsStore = defineStore("workouts", {
  state: () => ({
    currentWorkout: null,
    workoutsCache: {},
    courseProgress: {},
    workoutProgress: {},
    workoutsCompleted: {},
    isLoading: false,
    error: null,
    isInitialized: false,
  }),

  actions: {
    async authorizedFetch(url, options = {}) {
      const userStore = useUserStore();
      const headers = {
        Authorization: `Bearer ${userStore.token}`,
        "Content-Type": "",
        ...(options.headers || {}),
      };

      return await $fetch(url, {
        ...options,
        headers,
      });
    },

    handleError(error) {
      if (error.data?.message) return error.data.message;
      if (error.status === 401) return "Требуется авторизация";
      return "Произошла ошибка при выполнении запроса";
    },

    async fetchWorkout(workoutId) {
      const userStore = useUserStore();

      // ждем токен
      if (!userStore.token) {
        await userStore.fetchUserData();
        if (!userStore.token) throw new Error("Нет токена для запроса");
      }

      // проверяем кэш
      if (this.workoutsCache[workoutId]) {
        this.$patch((state) => {
          state.currentWorkout = state.workoutsCache[workoutId];
        });
        return this.currentWorkout;
      }

      this.isLoading = true;
      try {
        const workout = await this.authorizedFetch(
          `${API_BASE}/workouts/${workoutId}`
        );

        this.$patch((state) => {
          state.currentWorkout = workout;
          state.workoutsCache[workoutId] = workout;
        });

        return workout;
      } catch (e) {
        this.error = this.handleError(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchWorkoutProgress(courseId, workoutId) {
      try {
        this.workoutProgress[workoutId] = await this.authorizedFetch(
          `${API_BASE}/users/me/progress`,
          { params: { courseId, workoutId } }
        );
      } catch (e) {
        this.error = this.handleError(e);
        throw e;
      }
    },

    async fetchCourseProgress(courseId) {
      const coursesStore = useCoursesStore();
      try {
        const response = await this.authorizedFetch(
          `${API_BASE}/users/me/progress`,
          { params: { courseId } }
        );

        let courseWorkouts = await coursesStore.fetchCourseWorkouts(courseId);

        // сортировка по названию
        courseWorkouts = (courseWorkouts || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const validWorkoutIds = new Set(courseWorkouts.map((w) => w._id));

        const updatedProgress = {
          workoutsProgress: (response.workoutsProgress || []).filter((wp) =>
            validWorkoutIds.has(wp.workoutId)
          ),
          totalWorkouts: courseWorkouts.length,
        };

        this.courseProgress[courseId] = updatedProgress;

        updatedProgress.workoutsProgress.forEach((wp) => {
          this.workoutsCompleted[wp.workoutId] = wp.workoutCompleted;
        });
      } catch (e) {
        if (e.response?.status === 404) {
          this.courseProgress[courseId] ??= {
            workoutsProgress: [],
            totalWorkouts: 0,
          };
        } else {
          this.error = e?.data?.message || "Ошибка загрузки прогресса";
          throw e;
        }
      }
    },

    async saveWorkoutProgress(courseId, workoutId, progressData) {
      try {
        await this.authorizedFetch(
          `${API_BASE}/courses/${courseId}/workouts/${workoutId}`,
          { method: "PATCH", body: { progressData } }
        );

        const workoutCompleted = progressData.every((v) => v >= 100);

        this.$patch((state) => {
          state.workoutProgress[workoutId] = {
            ...(state.workoutProgress[workoutId] || {}),
            progressData,
            workoutCompleted,
            updatedAt: new Date().toISOString(),
          };

          const course = state.courseProgress[courseId];
          if (course) {
            const workouts = course.workoutsProgress;
            const idx = workouts.findIndex((wp) => wp.workoutId === workoutId);

            if (idx !== -1) {
              workouts[idx] = {
                ...workouts[idx],
                progressData,
                workoutCompleted,
              };
            } else {
              workouts.push({ workoutId, progressData, workoutCompleted });
            }

            course.completedCount = workouts.filter(
              (wp) => wp.workoutCompleted
            ).length;
          }
        });
      } catch (e) {
        this.error = e?.data?.message || "Ошибка сохранения прогресса";
        throw e;
      }
    },

    async resetWorkoutProgress(courseId, workoutId) {
      try {
        await this.authorizedFetch(
          `${API_BASE}/courses/${courseId}/workouts/${workoutId}/reset`,
          { method: "PATCH" }
        );

        if (this.workoutProgress[workoutId]) {
          this.workoutProgress[workoutId] = {
            workoutId,
            workoutCompleted: false,
            progressData: new Array(
              this.workoutProgress[workoutId].progressData.length
            ).fill(0),
          };
        }
      } catch (e) {
        this.error = e?.data?.message || "Ошибка сброса прогресса";
        throw e;
      }
    },

    // Утилиты
    isWorkoutCompleted(workoutId) {
      return this.workoutProgress[workoutId]?.workoutCompleted || false;
    },
    getExerciseProgress(workoutId, exerciseIndex) {
      return this.workoutProgress[workoutId]?.progressData[exerciseIndex] || 0;
    },
  },

  getters: {
    exercises: (state) => state.currentWorkout?.exercises || [],
    getWorkoutProgress: (state) => (workoutId) =>
      state.workoutProgress[workoutId]?.progressData || [],
    getCourseProgress: (state) => (courseId) =>
      state.courseProgress[courseId] || {
        workoutsProgress: [],
        totalWorkouts: 0,
      },
    getWorkoutCompletedStatus: (state) => (workoutId) =>
      state.workoutsCompleted[workoutId] ?? false,
  },
});

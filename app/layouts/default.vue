<template>
  <div class="layout">
    <div v-if="isInitializing" class="global-loader">
      <div class="loader"></div>
      <p>Инициализация приложения...</p>
    </div>

    <!-- Отображение ошибки инициализации -->
    <div v-else-if="initializationError" class="global-error">
      ⚠️ {{ initializationError }}
      <button @click="initializeStore">Попробовать снова</button>
    </div>

    <HeaderComponent v-if="!isAuthPage" :user="currentUser" />
    <main class="container">
      <div class="content-wrapper">
        <slot />
      </div>

      <div
        style="
          display: flex;
          justify-content: center;
          margin-top: 34px;
          margin-bottom: 80px;
        "
      >
        <BaseButton
          v-show="showScrollButton"
          aria-label="Вернуться наверх"
          @click="scrollToTop"
        >
          Наверх ↑
        </BaseButton>
      </div>
    </main>
    <footer>
      <!-- Футер -->
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseButton from "~/components/BaseButton.vue";
import HeaderComponent from "~/components/HeaderComponent.vue";
import { useCoursesStore } from "~/stores/courses";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const userStore = useUserStore();

const isAuthPage = computed(() => {
  return ["/authpage", "/regpage"].includes(route.path);
});

const currentUser = computed(() => userStore.currentUser);

const showScrollButton = ref(false);

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await nextTick();
  if (localStorage.getItem("fitnessToken")) {
    userStore.token = localStorage.getItem("fitnessToken");
    await userStore.fetchUserData();
  }
});

const coursesStore = useCoursesStore();
const isInitializing = ref(false);
const initializationError = ref(null);

const initializeStore = async () => {
  try {
    isInitializing.value = true;
    initializationError.value = null;

    // Загружаем токен и пользователя
    const token = localStorage.getItem("fitnessToken");
    if (token) {
      userStore.token = token;
      await userStore.fetchUserData();
    }

    // Загружаем курсы
    if (coursesStore.shouldFetchCourses) {
      await coursesStore.fetchCourses();
    }
  } catch (error) {
    console.error("Ошибка инициализации:", error);
    initializationError.value =
      error.message || "Ошибка загрузки начальных данных";
  } finally {
    isInitializing.value = false;
  }
};

// Запускаем инициализацию при монтировании
onMounted(() => {
  initializeStore();
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.container {
  width: 100%;
  margin: 0 auto;
}

.content-wrapper {
  max-width: 1160px;
  margin: 0 auto;
}

.scroll-top {
  position: fixed;
  bottom: 40px;
  left: 50%;
  font-size: 16px;
  background: #bcec30;
  color: #000;
  border: none;
  border-radius: 30px;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-top:hover {
  background: #a9d82a;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.scroll-top .text {
  display: inline-block;
}

@media (max-width: 1160px) {
  .content-wrapper {
    padding: 20px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0;
  }

  .scroll-top {
    padding: 8px 15px;
    border-radius: 25px;
    font-size: 18px;
    width: 127px;
    height: 52px;
    left: 70%;
  }

  .scroll-top svg {
    width: 16px;
    height: 16px;
  }
}

.global-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.global-error {
  padding: 2rem;
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

.global-error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.global-error button:hover {
  background: #dc2626;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

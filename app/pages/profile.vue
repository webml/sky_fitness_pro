<template>
  <div class="profile-container">
    <div v-if="isLoading" class="loading">
      <p>Загрузка данных профиля...</p>
    </div>

    <div v-else class="profile-content">
      <h1>Профиль</h1>

      <div class="profile-info">
        <img class="avatar" src="/img/default_avatar.svg" />

        <div class="details">
          <p class="name">{{ userDisplayName || "Не указано" }}</p>
          <p class="email">
            <strong>Email:</strong> {{ user.value?.email || "Не указан" }}
          </p>
          <BaseButton variant="secondary" @click="handleLogout"
            >Выйти</BaseButton
          >
        </div>
      </div>
    </div>

    <h3>Мои курсы</h3>
    <div class="card-list">
      <CourseCard
        v-for="(item, index) in userCourses"
        :key="index"
        :card="item"
      />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useCoursesStore } from "../stores/courses";
import { computed, onMounted } from "vue";

const userStore = useUserStore();
const coursesStore = useCoursesStore();
const isLoading = computed(() => userStore.isLoading);

// Получаем данные пользователя
const user = computed(() => {
  if (userStore.currentUser && userStore.currentUser.user) {
    return userStore.currentUser.user;
  }
  return {};
});

// Вычисляем имя из email
const userDisplayName = computed(() => {
  if (!user.value?.email) return "";
  const emailParts = user.value.email.split("@");
  return emailParts[0].replace(/\./g, " ");
});

// Получаем отфильтрованные курсы
const userCourses = computed(() => coursesStore.getUserCourses);

const waitForUser = async () => {
  return new Promise((resolve) => {
    const check = () => {
      if (userStore.currentUser && userStore.currentUser.user) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

onMounted(async () => {
  await waitForUser();
  try {
    const courseIds = userStore.currentUser?.user?.selectedCourses || [];

    await coursesStore.fetchCourses();

    if (courseIds.length > 0) {
      await coursesStore.fetchUserCourses(courseIds);
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
});

const handleLogout = () => {
  userStore.logout();
  navigateTo("/");
};
</script>

<style scoped>
.profile-container {
  display: block;
  width: 100%;

  box-sizing: border-box;
}

.profile-content {
  width: 100%;
}

.profile-info {
  display: flex;
  gap: 33px;
  margin-bottom: 20px;
  height: 257px;
  padding: 30px;
  align-items: stretch;
  background-color: hsla(0, 0%, 100%, 1);
  border-radius: 30px;
  box-shadow: 0px 4px 67px -12px hsla(0, 0%, 0%, 0.13);
}

.avatar {
  object-fit: cover;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-size: 32px;
  font-weight: 500;
  margin: 0;
}

.email {
  font-size: 18px;
  margin: 0;
}

.card-list {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .profile-info {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    height: 365px;
  }

  .avatar {
    width: 141px;
    height: 141px;
    margin: 0 auto;
  }

  .details p:first-child {
    font-size: 24px;
    text-align: center;
  }

  .details p:nth-child(2) {
    font-size: 16px;
    text-align: center;
  }

  .logout-btn {
    max-width: 283px;
    margin: 0 auto;
    padding: 10px;
    font-size: 16px;
  }
}
</style>

<template>
  <div class="container">
    <header class="header">
      <div class="left-section" @click="goToHome">
        <img src="/img/logo.svg" alt="Логотип" class="logo" />
        <span class="logo-text">Онлайн-тренировки для дома</span>
      </div>

      <div v-if="currentUser" class="user-section">
        <button class="user-dropdown" @click="toggleDropdown">
          <NuxtImg class="desktop-icon" src="/img/default_avatar.svg" />
          <span class="desktop-name">{{ userDisplayName }}</span>

          <NuxtImg
            src="/img/default_avatar.svg"
            class="mobile-icon"
            alt="Профиль"
          />

          <svg class="dropdown-icon" viewBox="0 0 10 6" fill="currentColor">
            <path d="M0 0l5 5 5-5" />
          </svg>
        </button>

        <div v-if="showDropdown" class="dropdown-menu">
          <div class="dropdown-content">
            <h3>{{ userDisplayName }}</h3>
            <p>{{ currentUser.user.email }}</p>
            <BaseButton @click="goToProfile" fullWidth>Мой профиль</BaseButton>
            <BaseButton variant="secondary" @click="handleLogout" fullWidth>
              Выйти
            </BaseButton>
          </div>
        </div>
      </div>

      <BaseButton v-else @click="showAuthModal = true">Войти</BaseButton>
    </header>

    <!-- Вызов модалки через компонент -->
    <AuthForm
      v-if="showAuthModal"
      @close="showAuthModal = false"
      :isModal="true"
    />
  </div>
</template>

<script setup>
import BaseButton from "./BaseButton.vue";
import AuthForm from "./AuthForm.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const currentUser = computed(() => userStore.currentUser);

const userDisplayName = computed(() => {
  if (!currentUser.value?.user) return "";
  const emailParts = currentUser.value.user.email.split("@");
  return emailParts[0].replace(/\./g, " ");
});

const showAuthModal = ref(false);
const showDropdown = ref(false);
const dropdownRef = ref(null);

const goToHome = () => {
  router.push("/");
};

const goToProfile = () => {
  router.push("/profile");
  showDropdown.value = false;
};

const handleLogout = () => {
  userStore.logout();
  showDropdown.value = false;
  router.push("/");
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Закрытие по клику вне меню
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.header {
  max-width: 1160px;
  margin: 0 auto;
  padding-bottom: 20px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;

  .left-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    .logo {
      display: block;
      max-height: 40px;
    }

    .logo-text {
      font-size: 16px;
      line-height: 1.2;

      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  .user-section {
    position: relative;
    cursor: pointer;
  }

  .desktop-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .desktop-name {
    padding-left: 16px;
  }

  .user-dropdown {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .desktop-name {
      @media (max-width: 768px) {
        display: none;
      }
    }

    .mobile-icon {
      display: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;

      @media (max-width: 768px) {
        display: block;
      }
    }

    .dropdown-icon {
      width: 12px;
      height: 6px;
      margin-left: 8px;
      transition: transform 0.3s;
    }

    &.active .dropdown-icon {
      transform: rotate(180deg);
    }

    @media (max-width: 768px) {
      padding: 8px;
    }
  }

  .dropdown-menu {
    width: 266px;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    z-index: 1000;
    overflow: hidden;
  }

  .dropdown-content {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .header {
    margin-top: 20px;
    padding: 0 15px;
  }

  .desktop-icon {
    display: none;
  }
}
</style>

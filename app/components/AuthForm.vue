<template>
  <Teleport to="body">
    <div class="wrapper" @click.self="props.isModal && emit('close')">
      <div class="modal">
        <form class="form" @submit.prevent="handleSubmit">
          <NuxtLink to="/">
            <div class="logo">
              <NuxtImg src="/img/logo.svg" alt="logo" />
            </div>
          </NuxtLink>

          <input
            v-model.trim="email"
            class="input"
            type="email"
            placeholder="Почта"
          />

          <input
            v-model.trim="password"
            class="input"
            type="password"
            placeholder="Пароль"
          />

          <input
            v-if="isSignIn"
            v-model.trim="confirmPassword"
            class="input"
            type="password"
            placeholder="Повторите пароль"
          />

          <!-- Блок ошибок между полями и кнопками -->
          <p v-if="userStore.error" class="error-message">
            {{ userStore.error }}
          </p>

          <BaseButton type="submit">
            {{ isSignIn ? "Зарегистрироваться" : "Войти" }}
          </BaseButton>

          <BaseButton
            type="button"
            variant="secondary"
            @click="$router.push(isSignIn ? '/auth' : '/reg')"
          >
            {{ isSignIn ? "Войти" : "Зарегистрироваться" }}
          </BaseButton>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  isModal: Boolean,
});
const emit = defineEmits(["close"]);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isSignIn = computed(() => route.path.includes("reg"));
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSubmit = async () => {
  try {
    userStore.error = null;

    if (!email.value || !password.value) {
      userStore.error = "Заполните все обязательные поля";
      return;
    }

    if (isSignIn.value) {
      if (!validateEmail(email.value)) {
        userStore.error = "Введите корректный email";
        return;
      }
      if (password.value !== confirmPassword.value) {
        userStore.error = "Пароли не совпадают";
        return;
      }

      // Регистрируем пользователя
      await userStore.register(email.value, password.value);
    } else {
      if (!validateEmail(email.value)) {
        userStore.error = "Введите корректный email";
        return;
      }

      // Авторизуем пользователя
      await userStore.login(email.value, password.value);
    }

    // Если ошибок нет и токен установлен, закрываем модалку или делаем редирект
    if (!userStore.error && userStore.token) {
      if (props.isModal) {
        emit("close");
      } else {
        router.push("/");
      }
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
    userStore.error = "Произошла ошибка, попробуйте позже";
  }
};

onMounted(() => {
  userStore.error = null;
});
</script>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
}

.modal {
  background: #fff;
  border-radius: 30px;
  width: 360px;
  max-height: 609px;
  padding: 40px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d0cece;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
}

.input:focus {
  border-color: #580ea2;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo img {
  max-width: 140px;
  height: auto;
}

/* Анимация */
.auth-form-enter-active,
.auth-form-leave-active {
  transition: opacity 0.2s ease;
}
.auth-form-enter-from,
.auth-form-leave-to {
  opacity: 0;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d0cece;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
}

.input:focus {
  border-color: #580ea2;
}

.error-message {
  color: #ff4d4d;
  padding: 12px;
  font-size: 14px;
}
</style>

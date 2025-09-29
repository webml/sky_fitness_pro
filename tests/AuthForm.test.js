import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia, defineStore } from "pinia";
import AuthForm from "../app/components/AuthForm.vue";

// Мокаем Vue Router до mount
const pushMock = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ path: "/auth" }),
}));

describe("AuthForm.vue", () => {
  let pinia;
  let userStore;

  const useUserStore = defineStore("user", {
    state: () => ({ error: null, token: null }),
    actions: {
      login() {},
      register() {},
    },
  });

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    userStore = useUserStore();
    userStore.error = null;
    userStore.token = null;

    userStore.login = vi.fn().mockResolvedValue(true);
    userStore.register = vi.fn().mockResolvedValue(true);

    pushMock.mockClear();
  });

  it("рендерит поля email и password", () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true, // чтобы рендерить модалку в тесте
          NuxtLink: true, // заглушка для NuxtLink
          NuxtImg: true, // заглушка для NuxtImg
          BaseButton: true, // заглушка для BaseButton
        },
      },
    });

    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it("показывает ошибку если поля пустые", async () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true,
          NuxtLink: true,
          NuxtImg: true,
          BaseButton: true,
        },
      },
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(userStore.error).toBe("Заполните все обязательные поля");
  });

  it("вызывает login при авторизации", async () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true,
          NuxtLink: true,
          NuxtImg: true,
          BaseButton: true,
        },
      },
    });

    await wrapper.find('input[type="email"]').setValue("test@example.com");
    await wrapper.find('input[type="password"]').setValue("123456");
    await wrapper.find("form").trigger("submit.prevent");

    expect(userStore.login).toHaveBeenCalledWith("test@example.com", "123456");
    expect(userStore.register).not.toHaveBeenCalled();
  });

  it("показывает ошибку при некорректном email", async () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true,
          NuxtLink: true,
          NuxtImg: true,
          BaseButton: true,
        },
      },
    });

    await wrapper.find('input[type="email"]').setValue("wrong-email");
    await wrapper.find('input[type="password"]').setValue("123456");
    await wrapper.find("form").trigger("submit.prevent");

    expect(userStore.error).toBe("Введите корректный email");
    expect(userStore.login).not.toHaveBeenCalled();
  });
});

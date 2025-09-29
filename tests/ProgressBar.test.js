import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressBar from "../app/components/ProgressBar.vue";

describe("ProgressBar.vue", () => {
  it("корректно отображает label и процент", () => {
    const wrapper = mount(ProgressBar, {
      props: {
        label: "Прогресс",
        current: 30,
        total: 60,
      },
    });

    // Проверка текста
    expect(wrapper.find(".progress-label").text()).toBe("Прогресс 50%");

    // Проверка ширины прогресс-бара
    const fill = wrapper.find(".progress-fill");
    expect(fill.element.style.width).toBe("50%");
  });

  it("возвращает 0% если total = 0", () => {
    const wrapper = mount(ProgressBar, {
      props: {
        label: "Прогресс",
        current: 10,
        total: 0,
      },
    });

    expect(wrapper.find(".progress-label").text()).toBe("Прогресс 0%");
    expect(wrapper.find(".progress-fill").element.style.width).toBe("0%");
  });

  it("округляет процент до целого числа", () => {
    const wrapper = mount(ProgressBar, {
      props: {
        label: "Прогресс",
        current: 7,
        total: 3,
      },
    });

    expect(wrapper.find(".progress-label").text()).toBe("Прогресс 233%");
    expect(wrapper.find(".progress-fill").element.style.width).toBe("233%");
  });
});

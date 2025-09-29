import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseButton from "../app/components/BaseButton.vue";

describe("BaseButton.vue", () => {
  it("рендерится с дефолтными props и текстом слота", () => {
    const wrapper = mount(BaseButton, {
      slots: { default: "Click me" },
    });

    // Проверка слота
    expect(wrapper.text()).toBe("Click me");

    // Проверка дефолтного класса variant
    expect(wrapper.classes()).toContain("primary");

    // Проверка ширины по дефолту
    expect(wrapper.classes()).toContain("w-auto");

    // Кнопка не disabled по дефолту
    expect(wrapper.attributes("disabled")).toBeUndefined();
  });

  it("подставляет fullWidth и disabled", () => {
    const wrapper = mount(BaseButton, {
      props: { fullWidth: true, disabled: true, variant: "secondary" },
      slots: { default: "Submit" },
    });

    expect(wrapper.classes()).toContain("secondary");
    expect(wrapper.classes()).toContain("w-full");
    expect(wrapper.attributes("disabled")).toBeDefined();
  });
});

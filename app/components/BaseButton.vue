<template>
  <button
    class="base-button"
    :class="[variant, fullWidth ? 'w-full' : 'w-auto']"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary", // "primary" (зелёная) или "secondary" (с обводкой)
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.base-button {
  height: 52px;
  padding: 16px 26px;
  border-radius: 46px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.w-full {
  width: 100%;
}

.w-auto {
  margin: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
}

/* ---------- PRIMARY ---------- */
.base-button.primary {
  background: hsla(75, 83%, 56%, 1);
  color: #000;
  border: none;
}
.base-button.primary:hover {
  background: hsla(73, 100%, 50%, 1);
}
.base-button.primary:active {
  background: hsla(0, 0%, 0%, 1);
  color: #fff;
}
.base-button.primary:disabled {
  background: hsla(0, 0%, 97%, 1);
  color: hsla(0, 0%, 60%, 1);
  cursor: not-allowed;
}

/* ---------- SECONDARY ---------- */
.base-button.secondary {
  background: #fff;
  border: 1px solid #000;
  color: hsla(0, 0%, 0%, 1);
}
.base-button.secondary:hover {
  background: hsla(0, 0%, 97%, 1);
}
.base-button.secondary:active {
  background: hsla(195, 10%, 92%, 1);
}
.base-button.secondary:disabled {
  background: #fff;
  border: 1px solid hsla(0, 0%, 60%, 1);
  color: hsla(0, 0%, 60%, 1);
  cursor: not-allowed;
}
</style>

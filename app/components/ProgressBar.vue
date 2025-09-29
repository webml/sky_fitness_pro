<template>
  <div class="progress-container">
    <div class="progress-label">{{ label }} {{ percentage }}%</div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const percentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.round((props.current / props.total) * 100);
});
</script>

<style scoped>
.progress-container {
  margin-bottom: 12px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #000;
}

.progress-label {
  margin-bottom: 4px;
}

.progress-bar {
  height: 6px;
  background-color: hsla(0, 0%, 97%, 1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: hsla(195, 100%, 50%, 1);
  transition: width 0.3s ease;
}
</style>

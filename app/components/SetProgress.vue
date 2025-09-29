<template>
  <teleport to="body">
    <div v-if="visible" class="modal-overlay">
      <div class="modal">
        <h3>Мой прогресс</h3>

        <!-- Скроллимый контейнер только для упражнений -->
        <div class="modal-content">
          <div
            v-for="(exercise, index) in exercises"
            :key="exercise._id || index"
            class="input-group"
          >
            <label :for="'exercise' + index">
              Сколько раз вы сделали {{ exercise.name.toLowerCase() }}?
            </label>
            <input
              :id="'exercise' + index"
              v-model.number="progress[index]"
              type="number"
              min="0"
              step="1"
              required
            />
          </div>
        </div>

        <!-- Футер с кнопкой -->
        <div class="modal-footer">
          <BaseButton type="button" @click="saveProgress" full-width>
            Сохранить
          </BaseButton>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  exercises: { type: Array, required: true },
  initialProgress: { type: Array, default: () => [] },
  visible: Boolean,
  onSave: { type: Function, required: true },
});

const emit = defineEmits(["update:visible"]);

const progress = ref([]);

// Инициализация прогресса
watch(
  () => [props.initialProgress, props.exercises],
  ([newProgress, newExercises]) => {
    const length = newExercises?.length || 0;
    const updated = new Array(length).fill(0);

    for (let i = 0; i < length; i++) {
      // подставляем существующее значение, либо 0
      updated[i] = newProgress?.[i] ?? 0;
    }

    progress.value = updated;
  },
  { immediate: true, deep: true }
);

const saveProgress = () => {
  // валидация: пустые поля и отрицательные числа → 0
  const validated = progress.value.map((val) =>
    Number.isInteger(val) && val > 0 ? val : 0
  );

  props.onSave(validated);
  emit("update:visible", false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 30px;
  width: 426px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 40px 40px 20px 40px;
}

.modal-content {
  overflow-y: auto;
  padding-right: 10px; /* чтобы скролл не перекрывал контент */
  flex: 1; /* занимает оставшееся пространство */
}

.modal-footer {
  margin-top: 20px;
  flex-shrink: 0; /* не сжимается при скролле */
}

.input-group {
  margin-top: 48px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input[type="number"] {
  width: 100%;
  padding: 18px 16px;
  border-radius: 8px;
  border: 1px solid hsla(0, 2%, 81%, 1);
  font-family: Roboto;
  font-size: 18px;
  line-height: 110%;
}
</style>

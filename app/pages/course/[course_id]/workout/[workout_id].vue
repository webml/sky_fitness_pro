<template>
  <div v-if="workout">
    <h2>{{ workout.name }}</h2>

    <div class="video-wrapper">
      <iframe
        :src="workout.video"
        title="Видео тренировки"
        allowfullscreen
        class="video-player"
      />
    </div>

    <div v-if="exercises.length > 0" class="exercises-list">
      <h3>Упражнения</h3>
      <div class="exercise-wrapper">
        <ProgressBar
          v-for="(exercise, index) in exercises"
          :key="exercise._id || index"
          :label="exercise.name"
          :total="exercise.quantity"
          :current="getProgress(index)"
        />
      </div>

      <BaseButton @click="isProgressModalVisible = true">
        Обновить свой прогресс
      </BaseButton>
    </div>

    <div v-else>
      <BaseButton @click="() => updateProgress([])">
        Отметить выполненным
      </BaseButton>
    </div>

    <!-- Модалка ввода прогресса -->
    <SetProgress
      v-model:visible="isProgressModalVisible"
      :exercises="exercises"
      :initialProgress="currentProgress"
      @save="updateProgress"
    />

    <!-- Модалка "Сохранено" -->
    <ProgressSaved v-model:visible="isSavedModalVisible" />
  </div>

  <div v-else class="loading">Загрузка...</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useWorkoutsStore } from "@/stores/workouts";

const route = useRoute();
const workoutsStore = useWorkoutsStore();

const isProgressModalVisible = ref(false);
const isSavedModalVisible = ref(false);

const workoutId = route.params.workout_id;
const courseId = route.params.course_id;

const workout = computed(() => workoutsStore.currentWorkout);
const exercises = computed(() => workoutsStore.exercises);
const currentProgress = computed(() =>
  workoutsStore.getWorkoutProgress(workoutId)
);

const getProgress = (index) =>
  workoutsStore.getExerciseProgress(workoutId, index);

const loadWorkout = async () => {
  try {
    await workoutsStore.fetchWorkout(workoutId);
  } catch (e) {
    console.error("Ошибка загрузки тренировки:", e);
  }
};

const updateProgress = async (newProgress) => {
  try {
    await workoutsStore.saveWorkoutProgress(courseId, workoutId, newProgress);

    // Закрываем модалку ввода
    isProgressModalVisible.value = false;
    // Показываем модалку "Сохранено"
    isSavedModalVisible.value = true;

    setTimeout(() => (isSavedModalVisible.value = false), 2000);
  } catch (e) {
    console.error("Ошибка обновления прогресса:", e);
  }
};

onMounted(loadWorkout);
</script>

<style lang="scss" scoped>
.video-wrapper {
  margin: 40px 0;
  border-radius: 30px;
  overflow: hidden;
}
.video-player {
  width: 100%;
  height: 500px;
  border: none;
}
.exercises-list {
  width: 1160px;
  min-height: 375px;
  gap: 24px;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0px 4px 67px -12px hsla(0, 0%, 0%, 0.13);
}
.exercise-wrapper {
  margin: 40px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 60px;
}
.loading {
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .exercise-wrapper {
    margin: 40px 0;
    display: flex;
    flex-direction: column;
    gap: 20px 60px;
  }

  .exercises-list {
    width: 100%;
  }
}
</style>

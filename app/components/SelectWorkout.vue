<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="close">
      <div class="modal">
        <h3>Выберите тренировку</h3>

        <div v-if="isLoading" class="loading">Загрузка...</div>
        <ul v-else class="workout-list">
          <li
            v-for="(workout, index) in workouts"
            :key="workout._id"
            :class="{
              completed: isWorkoutCompleted(workout._id),
              selected: selectedWorkout === workout._id,
            }"
            @click="selectedWorkout = workout._id"
          >
            <div class="workout-header">
              <span
                class="checkbox"
                :class="{ checked: isWorkoutCompleted(workout._id) }"
              ></span>
            </div>
            <div>
              <span>{{ workout.name }}</span>
              <p class="workout-subtitle">
                {{ course.nameRU }} / {{ index + 1 }} день
              </p>
            </div>
          </li>
        </ul>

        <BaseButton
          :disabled="!selectedWorkout"
          full-width
          @click="startWorkout"
        >
          Начать
        </BaseButton>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWorkoutsStore } from "@/stores/workouts";
import { useCoursesStore } from "@/stores/courses";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const router = useRouter();
const workoutsStore = useWorkoutsStore();
const coursesStore = useCoursesStore();

const isLoading = ref(true);
const workouts = ref([]);
const selectedWorkout = ref(null);

const loadWorkouts = async () => {
  try {
    isLoading.value = true;
    // тут была ошибка — cours вместо course
    workouts.value = await coursesStore.fetchCourseWorkouts(props.course._id);
    await workoutsStore.fetchCourseProgress(props.course._id);
  } finally {
    isLoading.value = false;
  }
};

const isWorkoutCompleted = (workoutId) =>
  workoutsStore.isWorkoutCompleted(workoutId);

const startWorkout = () => {
  if (!selectedWorkout.value) return;
  router.push(`/course/${props.course._id}/workout/${selectedWorkout.value}`);
  close();
};

const close = () => {
  emit("close");
};

onMounted(loadWorkouts);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 460px;
  max-height: 80vh;
  overflow-y: auto;
}

h3 {
  margin-bottom: 16px;
  font-weight: 400;
  text-align: center;
}

.workout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  gap: 8px;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  flex-shrink: 0;
}

.checkbox.checked {
  background: hsla(75, 83%, 56%, 1);
  border-color: hsla(75, 83%, 56%, 1);
}

.checkbox.checked::after {
  content: "✔";
  color: #fff;
  font-size: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
}

.workout-list {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 20px;
}

.workout-list li {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  font-size: 24px;
  gap: 15px;
}

.workout-list li.completed {
  color: #999;
}

.workout-list li.selected {
  background: #e6f7ff;
  border: 1px solid #1890ff;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.workout-subtitle {
  font-size: 14px;
  color: #666;
}

.check {
  color: green;
  font-weight: bold;
}

.start-btn {
  width: 100%;
  padding: 12px;
  background: #b3f000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}

.start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>

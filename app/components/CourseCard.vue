<template>
  <div class="card" @click="goToCourse">
    <div class="card-image">
      <NuxtImg :src="image" alt="card image" class="person" />
      <button
        class="toggle-button"
        :title="isAdded ? 'Удалить курс' : 'Добавить курс'"
        @click.stop="toggleActive"
      >
        <img :src="iconSrc" />
      </button>
    </div>

    <div class="card-content">
      <h3>{{ card.nameRU }}</h3>
      <CardInfo :card="card" />

      <ProgressBar
        v-if="isAdded"
        label="Прогресс"
        :current="progressData.current"
        :total="progressData.total"
      />

      <BaseButton v-if="isAdded" @click.stop="toggleShowWorkoutModal">{{
        startButtonText
      }}</BaseButton>
    </div>

    <SelectWorkout
      v-if="showWorkoutModal"
      :course="card"
      @close="showWorkoutModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useCoursesStore } from "@/stores/courses";
import { useWorkoutsStore } from "@/stores/workouts";

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const userStore = useUserStore();
const coursesStore = useCoursesStore();
const workoutsStore = useWorkoutsStore();

const showWorkoutModal = ref(false);
const toggleShowWorkoutModal = () => {
  showWorkoutModal.value = !showWorkoutModal.value;
};

const userCourses = computed(
  () => userStore.currentUser?.user?.selectedCourses || []
);
const isAdded = computed(() => userCourses.value.includes(props.card._id));

const toggleActive = async () => {
  try {
    if (isAdded.value) {
      await coursesStore.removeCourse(props.card._id);
    } else {
      await coursesStore.addCourse(props.card._id);
    }
    await userStore.fetchUserData();
  } catch (error) {
    console.error("Ошибка при изменении статуса курса:", error);
  }
};

const iconSrc = computed(
  () => `/icons/${isAdded.value ? "minus" : "plus"}.svg`
);

const image = computed(() => `/img/${props.card._id}.png`);

const goToCourse = () => {
  router.push(`/course/${props.card._id}`);
};

// --- Прогресс курса ---
const progressData = ref({
  current: 0,
  total: 0,
});

const updateProgress = () => {
  const courseProgress = workoutsStore.getCourseProgress(props.card._id);
  progressData.value = {
    current: courseProgress.workoutsProgress.filter((w) => w.workoutCompleted)
      .length,
    total: courseProgress.totalWorkouts,
  };
};

watch(isAdded, async (newVal) => {
  if (newVal) {
    await workoutsStore.fetchCourseProgress(props.card._id);
    updateProgress();
  } else {
    progressData.value = { current: 0, total: 0 };
  }
});

onMounted(async () => {
  if (isAdded.value) {
    await workoutsStore.fetchCourseProgress(props.card._id);
    updateProgress();
  }
});

const startButtonText = computed(() => {
  if (progressData.value.current === 0) return "Начать тренировку";
  return progressData.value.current < progressData.value.total
    ? "Продолжить тренировку"
    : "Начать заново";
});
</script>

<style scoped>
.card {
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 360px;
  background: #fff;
  font-family: sans-serif;
  cursor: pointer;
}

.card-image {
  position: relative;
  height: 325px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image .person {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.toggle-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  width: 32px;
  height: 32px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  cursor: pointer;
}

.card-content {
  padding: 30px 24px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-content h3 {
  margin-bottom: 20px;
}
</style>

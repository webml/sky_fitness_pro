<template>
  <div class="course-page">
    <div v-if="loading" class="loader" />
    <div v-else>
      <div class="course-image-wrapper">
        <img
          :src="courseImage"
          :alt="course.nameRU"
          class="course-main-image"
        />
        <h1 style="display: none">{{ course.nameRU }}</h1>
      </div>
      <CourseAbout :course="course" />
      <GetCourse :course_id="course._id" />
    </div>
  </div>
</template>

<script setup>
import { useCoursesStore } from "~/stores/courses";
const route = useRoute();
const coursesStore = useCoursesStore();

const course = ref(null);
const loading = ref(true);

const courseImage = computed(() => `/img/${route.params.course_id}_wide.png`);

onMounted(async () => {
  try {
    course.value = await coursesStore.getCourseById(route.params.course_id);
  } catch (err) {
    err.value = err.message || "Ошибка загрузки курса";
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.course-page {
  min-height: 80vh;
  position: relative;
}

.course-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 60px;

  .course-main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>

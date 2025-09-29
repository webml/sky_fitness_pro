<template>
  <div>
    <div class="wrapper">
      <div class="text-container">
        <h2>Начните заниматься спортом <br />и улучшите качество жизни</h2>
      </div>
      <div class="image-container">
        <img src="/img/bubble.svg" alt="Измени свое тело за полгода" />
      </div>
    </div>
    <div class="card-list">
      <CourseCard
        v-for="(item, index) in coursesStore.courses"
        :key="index"
        :card="item"
      />
    </div>
  </div>
</template>

<script setup>
import { useCoursesStore } from "~/stores/courses";

const coursesStore = useCoursesStore();

onMounted(async () => {
  await coursesStore.fetchCourses();
});
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.text-container {
  flex: 1;
}

.image-container {
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .main-title {
    font-size: 32px;
  }

  .image-container {
    display: none;
  }
}
</style>

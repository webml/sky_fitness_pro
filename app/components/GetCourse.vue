<template>
  <div class="benefits-wrapper">
    <div class="benefits-section">
      <div class="content-wrapper">
        <h2>
          Начните путь<br />
          к новому телу
        </h2>
        <ul class="benefits-list">
          <li>Проработка всех групп мышц</li>
          <li>Тренировка суставов</li>
          <li>Улучшение циркуляции крови</li>
          <li>Упражнения заряжают бодростью</li>
          <li>Помогают противостоять стрессам</li>
        </ul>

        <BaseButton
          v-if="!isAuthenticated"
          full-width
          @click="handleAuthRedirect"
        >
          Войдите, чтобы добавить курс
        </BaseButton>

        <div v-else class="course-actions">
          <BaseButton
            :disabled="isProcessing"
            :variant="isCourseAdded ? 'secondary' : 'primary'"
            @click="handleCourseToggle"
          >
            {{ isCourseAdded ? "Удалить курс" : "Добавить курс" }}
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="image-overlay">
      <img src="/img/get_course_bg.svg" class="background-image" />
      <img src="/img/run_man.png" class="foreground-image" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useCoursesStore } from "@/stores/courses";

const props = defineProps({
  course_id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const coursesStore = useCoursesStore();

const isProcessing = ref(false);

const isAuthenticated = computed(() => userStore.isAuthenticated);

const isCourseAdded = computed(() =>
  userStore.currentUser?.user?.selectedCourses?.includes(props.course_id)
);

const handleCourseToggle = async () => {
  isProcessing.value = true;

  try {
    if (isCourseAdded.value) {
      await coursesStore.removeCourse(props.course_id);
    } else {
      await coursesStore.addCourse(props.course_id);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    alert(error.message);
  } finally {
    isProcessing.value = false;
  }
};

const handleAuthRedirect = () => {
  const redirectPath = route.fullPath;
  router.push({
    path: "/auth",
    query: { redirect: redirectPath },
  });
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.benefits-section {
  position: relative;
  padding: 40px;
  border-radius: 30px;
  margin-top: 100px;
  background-color: #fff;
  box-shadow: 0px 4px 67px -12px rgba(0, 0, 0, 0.13);
  box-sizing: border-box;
  z-index: 2; /* карточка выше фона */
}

.benefits-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefits-list li {
  list-style: disc;
  font-size: 24px;
  font-weight: 400;
}

.image-overlay {
  position: absolute; /* десктоп — поверх карточки */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3; /* поверх карточки на десктопе */
}

.background-image {
  position: absolute;
  bottom: -50px;
  width: 100%;
  height: auto;
}

.foreground-image {
  position: absolute;
  bottom: 0;
  right: 30px;
  width: 44%;
  object-fit: contain;
  z-index: 4; /* поверх карточки */
}

.auth-button:hover {
  background: #a8d52b;
}

/* -------------------- Мобильная версия -------------------- */
@media (max-width: 768px) {
  .image-overlay {
    position: relative;
    margin-top: -50%; /* торчит вверх из-под карточки */
    z-index: 1; /* под карточкой */
    height: auto;
  }

  .background-image {
    position: absolute;
    bottom: auto;
    width: 100%;
    display: block;
    bottom: 40%;
  }

  .foreground-image {
    position: absolute;
    bottom: -20%;
    right: -30%;
    transform: translateX(-50%);
    width: 70%;
    z-index: 1;
  }
}
</style>

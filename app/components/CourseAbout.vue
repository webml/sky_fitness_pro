<template>
  <div class="content">
    <div class="section">
      <h3>Подойдет для вас, если:</h3>
      <div class="target-list">
        <div
          v-for="(fit, index) in course.fitting"
          :key="index"
          class="target-item"
        >
          <span class="number">{{ index + 1 }}</span>
          <p class="fit-text">{{ fit }}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Направления:</h3>
      <div class="directions-wrapper">
        <ul class="directions-list">
          <li
            v-for="(direction, index) in course.directions"
            :key="index"
            class="direction-item"
          >
            <img src="/icons/sparcle.svg" />
            {{ direction }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  course: Object,
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.target-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

.target-item {
  background: #222;
  color: #fff;
  padding: 20px;
  border-radius: 28px;
  display: flex;
  align-items: baseline;
  flex: 1 1 calc(33.33% - 1rem);
  min-width: 150px;
  width: calc(33.33% - 1rem);
  font-size: 24px;

  .fit-text {
    line-height: 1.4;
    word-break: break-word;
  }
}

.number {
  font-size: 4rem;
  margin-right: 1rem;
  color: #bcec30;
  align-self: center;
}

.directions-wrapper {
  background: #bcec30;
  border-radius: 12px;
  padding: 1rem;
}

.directions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
  list-style: none;
  width: 100%;
}

.direction-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  font-size: 24px;
  border-radius: 8px;
  flex: 1 1 calc(33.33% - 2rem);
}

@media (max-width: 768px) {
  .directions-list,
  .targets-list {
    flex-direction: column;
  }

  .target-item {
    width: 100%;
    flex: none;
  }
}
</style>

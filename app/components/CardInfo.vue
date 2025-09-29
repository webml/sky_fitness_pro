<template>
  <div class="badges">
    <div class="badge">
      <img src="/icons/calendar.svg" />
      <span>{{ card.durationInDays }} дней</span>
    </div>

    <div class="badge">
      <img src="/icons/time.svg" />
      <span
        >{{ card.dailyDurationInMinutes.from }}-{{
          card.dailyDurationInMinutes.to
        }}
        мин/день</span
      >
    </div>

    <div class="badge">
      <img src="/icons/signal.svg" />
      {{ card.difficulty }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: Object,
});
</script>

<style lang="scss" scoped>
.badge {
  background-color: hsla(0, 0%, 97%, 1);
  width: fit-content;
  height: 38;
  opacity: 1;
  border-radius: 50px;
  gap: 6px;
  padding: 10px;
  align-items: center;
  display: flex;
  flex-direction: row;
}

.badges {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
}
</style>

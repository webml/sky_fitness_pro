<template>
  <teleport to="body">
    <div v-if="visible" class="modal-overlay">
      <div class="modal">
        <h3>Ваш прогресс засчитан!</h3>

        <div class="modal-content">
          <span class="checkbox checked"></span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  visible: Boolean,
});
</script>

<style scoped>
h3 {
  font-family: Roboto;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 40px;
  line-height: 110%;
  letter-spacing: 0px;
  text-align: center;
}
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
  display: flex;
  justify-content: center;
}

.checkbox {
  margin-top: 34px;
  width: 68px;
  height: 68px;
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
  font-size: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
}
</style>

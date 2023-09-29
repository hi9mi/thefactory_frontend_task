<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import VueInlineSvg from "vue-inline-svg";

import arrowTopIcon from "../assets/icons/arrow-top.svg";

const isShowAffix = ref(false);

function onScroll() {
  if (window.scrollY >= 100)
    isShowAffix.value = true;
  else
    isShowAffix.value = false;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <Teleport to="#affix">
    <button
      v-if="isShowAffix"
      class="affix"
      @click="scrollToTop"
    >
      <vue-inline-svg
        :src="arrowTopIcon"
        fill="none"
        width="18"
        height="18"
        aria-label="Вернуться наверх"
      />
    </button>
  </Teleport>
</template>

<style scoped>
.affix {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    background-color: #fff;
    border: none;
    outline: none;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    color: #000;
    cursor: pointer;
}
</style>

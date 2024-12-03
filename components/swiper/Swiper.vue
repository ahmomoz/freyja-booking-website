<script setup>
import Swiper from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const props = defineProps({
  autoplay: Object,
  pagination: Object,
  navigation: Object,
  loop: Boolean,
  slidesPerView: Number,
  modules: Array,
  breakpoints: Object,
  haveBtn: Boolean
});

const swiperRef = ref(null);
onMounted(() => {
  new Swiper(swiperRef.value, props);
});
</script>

<template>
  <div class="swiper" ref="swiperRef">
    <div class="swiper-wrapper">
      <slot />
    </div>
    <div class="swiper-pagination"></div>

    <template v-if="haveBtn">
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </template>
  </div>
</template>

<style scoped></style>
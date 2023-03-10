<template>
  <div>
    <app-header></app-header>
    <Nuxt />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
export default {
  components: {
    "app-header": Header,
  },
};
</script>
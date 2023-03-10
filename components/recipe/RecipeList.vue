<template>
  <div class="container">
    <div class="row g-5">
      <app-recipe-item v-for="data in dataRecipes" :key="data.id" :recipe="data" :isUser="isUser"></app-recipe-item
      >
    </div>
  </div>
</template>

<script>
import RecipeItem from "./RecipeItem.vue";
export default {
  props: {
    dataRecipes: {
      type: Array,
      default: ''
    },
    isUser: {
      type: Boolean,
      default: false
    }
  },
  components: {
    "app-recipe-item": RecipeItem,
  },
};
</script>
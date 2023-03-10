<template>
  <div>
    <app-recipe-list :dataRecipes="recipes"></app-recipe-list>
  </div>
</template>
<script>
import RecipeList from "../components/recipe/RecipeList.vue";
export default {
  middleware: "check-auth",
  computed: {
    recipes() {
      return this.$store.getters.recipeData;
    },
  },
  components: {
    "app-recipe-list": RecipeList,
  },
};
</script>

<style scoped>
div {
  margin-bottom: 50px;
}
</style>

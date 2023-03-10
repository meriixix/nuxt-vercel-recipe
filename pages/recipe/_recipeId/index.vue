<template>
  <div>
    <div class="recipes-detail">
      <div>
        <img
          class="recipes-detail__img"
          :alt="recipe.recipeTitle"
          :src="recipe.recipeImage"
        />
        <h1 class="recipes-detail__title">{{ recipe.recipeTitle }}</h1>
        <p style="text-align: justify;">{{ recipe.description }}</p>
        <p>Recipe by:<b> {{ recipe.username }}</b></p>
        <hr>
        <div>
          <h2>Ingredients</h2>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="(item, index) in recipe.ingredients"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <hr>
        <div>
          <h2>Directions</h2>
          <div v-for="(item, index) in recipe.directions" :key="index">
            <h5>Step {{ index + 1 }}</h5>
            <p>{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, params }) {
    const recipe = store.getters.detailRecipe(params.recipeId);
    return { recipe };
  },
};
</script>

<style scoped>
.recipes-detail {
  display: flex;
  justify-content: center;
}

.recipes-detail div {
  width: 600px;
}

.recipes-detail__img {
  width: 400px;
  height: 300px;
  display: block;
  text-align: center;
  margin: 0px auto;
}

.recipes-detail__title {
  text-align: center;
}
</style>
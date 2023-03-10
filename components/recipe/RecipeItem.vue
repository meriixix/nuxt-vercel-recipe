<template>
  <div class="col-md-3">
    <div class="card">
      <img
        class="recipes-content__img card-img-top rounded"
        :alt="recipe.recipeTitle"
        :src="recipe.recipeImage"
      />
      <div class="card-body">
        <p class="username">{{ recipe.username }}</p>
        <nuxt-link
          tag="h1"
          :to="{ name: 'recipe-recipeId', params: { recipeId: recipe.id } }"
          class="card-text fs-5 text"
          style="height: 45px; align-item: center"
          >{{ recipe.recipeTitle }}</nuxt-link
        >
        <div class="recipes-content__body__review card-footer bg-transparent row">
          <div class="col-2">
            <img :src="likeImage" alt="Heart" @click="likeClick" />
          </div>
          <div class="col-6">
            <p>{{ likeCount }} likes</p>
          </div>
          <div v-show="isUser" class="col-2">
            <img src="images/delete.png" alt="Delete" @click="deleteRecipe" />
          </div>
          <div v-show="isUser" class="col-2">
            <img src="images/edit.png" alt="Edit" @click="editRecipe" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recipe: {
      type: Object,
      default: "",
    },
    isUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // currentLikeImage: "images/heart-black.png",
      // likeImage: ["images/heart-black.png", "images/heart-red.png"],
    };
  },
  computed: {
    likeCount() {
      if (this.recipe.dataLikes.length === 1) {
        if (this.recipe.dataLikes[0] === "null") {
          return 0;
        }
        return 1;
      }
      return this.recipe.dataLikes.length;
    },
    likeImage() {
      const userEmail = this.$store.getters.userEmail;
      const checkLike = this.recipe.dataLikes.filter(
        (item) => item === userEmail
      );
      if (checkLike.length === 0) {
        return "images/heart-black.png";
      }
      return "images/heart-red.png";
    },
  },
  methods: {
    likeClick() {
      if (!this.$store.getters.isAuthenticated) {
        this.$router.push("/user/login");
        return;
      }
      const userEmail = this.$store.getters.userEmail;
      const recipe = this.recipe;
      if (recipe.dataLikes.length === 1 && recipe.dataLikes[0] === "null") {
        recipe.dataLikes[0] = userEmail;
      } else {
        const checkLike = recipe.dataLikes.filter((item) => item === userEmail);
        if (checkLike.length === 0) {
          recipe.dataLikes.push(userEmail);
        } else {
          if (recipe.dataLikes.length === 1) {
            recipe.dataLikes[0] = "null";
          } else {
            const userEmailIndex = recipe.dataLikes.findIndex(
              (item) => item === userEmail
            );
            recipe.dataLikes.splice(userEmailIndex, 1);
          }
        }
      }
      let { id: _, ...newRecipe } = recipe;
      this.$store.dispatch("likeUpdate", {
        recipeId: this.recipe.id,
        newDataRecipe: newRecipe,
      });
    },
    deleteRecipe() {
      this.$store.dispatch("deleteRecipe", this.recipe.id)
    },
    editRecipe() {
      console.log("edit");
    },
  },
};
</script>

<style>
.recipes-content__img {
  width: 100%;
  height: 25vh;
}

.recipes-content__body__review {
  display: flex;
  align-items: center;
}

.recipes-content__body__review img {
  width: 20px;
  height: 20px;
  margin: 5px 10px 5px 0px;
}

.recipes-content__body__review p {
  margin: 0px;
}

.recipes-content__body__review img:hover {
  cursor: pointer;
}

.username {
  margin-bottom: 0px;
}
</style>
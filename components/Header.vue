<template>
  <header class="navbar bg-light">
    <div class="container-fluid">
      <nuxt-link tag="a" class="navbar-brand text-brand" to="/">
        <img
          src="/images/logo.png"
          alt="Logo"
          width="44"
          height="44"
          class="d-inline-block align-text-center"
        />
        Food Recipes
      </nuxt-link>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <nuxt-link to="/" tag="a" class="nav-link active" aria-current="page"
            >Home</nuxt-link
          >
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/add">New Recipe</nuxt-link>
        </li>
        <li class="nav-item" v-if="!$store.getters.isAuthenticated">
          <nuxt-link class="nav-link" to="/user/login">Login</nuxt-link>
        </li>
        <li class="nav-item" v-if="$store.getters.isAuthenticated">
          <a class="nav-link" @click="logout">Logout</a>
        </li>
        <li class="nav-item" v-if="$store.getters.isAuthenticated">
          <nuxt-link class="nav-link" tag="a" to="/user">{{
            $store.state.userData.username
          }}</nuxt-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/user/login");
    },
  },
};
</script>

<style>
header {
  margin-bottom: 20px;
}

a:hover {
  cursor: pointer;
}

.text-brand {
  font-family: 'Satisfy', cursive;
}
</style>
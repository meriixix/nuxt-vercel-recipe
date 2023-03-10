import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      recipes: [],
      token: null,
      userData: null,
    },
    getters: {
      recipeData(state) {
        return state.recipes;
      },
      lastIdRecipe(state) {
        let recipesLength = state.recipes.length;
        return state.recipes[recipesLength - 1].id;
      },
      detailRecipe: (state) => (id) => {
        return state.recipes.find((recipe) => recipe.id === id);
      },
      isAuthenticated(state) {
        return state.token != null;
      },
      userId(state) {
        return state.userData.userId;
      },
      userEmail(state) {
        if (state.userData === null) {
          return;
        }
        return state.userData.email;
      },
    },
    mutations: {
      addNewRecipe(state, payload) {
        return state.recipes.push(payload);
      },
      setRecipe(state, payload) {
        state.recipes = payload;
      },
      setToken(state, payload) {
        state.token = payload;
      },
      setUserData(state, payload) {
        state.userData = payload;
      },
    },
    actions: {
      nuxtServerInit({ commit, dispatch }) {
        return axios
          .get(
            "https://app-recipe-e736a-default-rtdb.firebaseio.com/datarecipe.json"
          )
          .then((response) => {
            console.log(response)
            const recipeArray = [];
            for (const key in response.data) {
              recipeArray.push({ ...response.data[key], id: key });
            }
            commit("setRecipe", recipeArray);
          })
          .catch((e) => context.error(e));
      },
      getRecipe({ commit }) {
        return axios
          .get(
            "https://app-recipe-e736a-default-rtdb.firebaseio.com/datarecipe.json"
          )
          .then((response) => {
            const recipeArray = [];
            for (const key in response.data) {
              recipeArray.push({ ...response.data[key], id: key });
            }
            commit("setRecipe", recipeArray);
          })
          .catch((e) => context.error(e));
      },
      addRecipe({ commit, state }, recipe) {
        return axios
          .post(
            "https://app-recipe-e736a-default-rtdb.firebaseio.com/datarecipe.json?auth=" +
              state.token,
            {
              ...recipe,
              userId: state.userData.userId,
              username: state.userData.username,
              dataLikes: ["null"],
            }
          )
          .then((response) => {
            commit("addNewRecipe", {
              ...recipe,
              dataLikes: ["null"],
              userId: state.userData.userId,
              username: state.userData.username,
              id: response.data.name,
            });
          });
      },
      likeUpdate({ commit, state, dispatch }, recipe) {
        return axios
          .put(
            "https://app-recipe-e736a-default-rtdb.firebaseio.com/datarecipe/" +
              recipe.recipeId +
              ".json?auth=" +
              state.token,
            recipe.newDataRecipe
          )
          .then((res) => dispatch("getRecipe"));
      },
      authenticateUser({ commit, state }, authData) {
        let webAPIKey = "AIzaSyAij0oArB2ZrBoXdtlJpO-nz1-MYiQ3Bmw";
        let authUrl = authData.isLogin
          ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
          : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

        return axios
          .post(authUrl + webAPIKey, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
            displayName: authData.displayName,
          })
          .then((response) => {
            console.log(response);
            commit("setToken", response.data.idToken);
            commit("setUserData", {
              username: response.data.displayName,
              userId: response.data.localId,
              email: response.data.email,
            });

            // Menyimpan Token pada local storage dan cookies
            localStorage.setItem("token", response.data.idToken);
            Cookie.set("jwt", response.data.idToken);

            // Menyimpan data expires pada local storage dan cookie
            localStorage.setItem(
              "tokenExpiration",
              new Date().getTime() +
                Number.parseInt(response.data.expiresIn) * 1000
            );
            Cookie.set(
              "expirationDate",
              new Date().getTime() +
                Number.parseInt(response.data.expiresIn) * 1000
            );

            const userData = {
              username: response.data.displayName,
              userId: response.data.localId,
              email: response.data.email,
            };

            localStorage.setItem("user", JSON.stringify(userData));
            Cookie.set("acc_user", JSON.stringify(userData));
          })
          .catch((error) => console.log(error));
      },
      initAuth({ commit, dispatch }, req) {
        let token;
        let user;
        let expirationDate;
        // Apabila req tidak bernilai undifined (Halaman web dijalankan pada sisi server)
        if (req) {
          // Apabila tidak ada cookie yang ditemukan
          if (!req.headers.cookie) {
            return;
          }

          // Code ini digunakan untuk mengambil cookie bernama jwt
          const jwtCookie = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("jwt="));

          // Get User Cookie
          const accUserCookie = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("acc_user="));

          // Mengambil data user dari cookie
          const userCookie = accUserCookie.substr(
            accUserCookie.indexOf("=") + 1
          );
          // Data yang diperoleh dalam bentuk JSON, maka harus diubah menjadi object
          user = JSON.parse(decodeURIComponent(userCookie));

          // Jika tidak ditemukan cookie yang diperlukan
          if (!jwtCookie) {
            return;
          }

          // Mengambil data token dari cookie
          token = jwtCookie.split("=")[1];

          // Mengambil data expires dari cookie
          expirationDate = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("expirationDate="))
            .split("=")[1];

          // Apabila halaman web dijalankan dari sisi client
        } else {
          token = localStorage.getItem("token");
          user = JSON.parse(localStorage.getItem("user"));
          expirationDate = localStorage.getItem("tokenExpiration");
        }

        // Tanda plus digunakan untuk mengubah kedalam bentuk number
        if (new Date().getTime() > +expirationDate || !token) {
          console.log("No token or invalid token");
          dispatch("logout");
          return;
        }

        commit("setToken", token);
        commit("setUserData", user);
      },
      logout({ commit }) {
        commit("setToken", null);
        Cookie.remove("jwt");
        Cookie.remove("acc_user");
        Cookie.remove("expirationDate");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("tokenExpiration");
        }
      },
      deleteRecipe({ dispatch, state }, recipeId) {
        return axios
          .delete(
            "https://app-recipe-e736a-default-rtdb.firebaseio.com/datarecipe/" +
              recipeId +
              ".json?auth=" +
              state.token
          )
          .then((res) => dispatch("getRecipe"));
      },
    },
  });
};
export default createStore;

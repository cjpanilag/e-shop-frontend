import axios from "axios";

export default {
  namespaced: true,

  state: {
    token: null,
    user: {},
    response: {
      code: null,
      message: null,
    },
  },

  getters: {
    authenticated(state) {
      return state.token && state.user;
    },

    user(state) {
      return state.user;
    },

    response(state) {
      return state.response;
    },
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },

    SET_USER(state, data) {
      state.user = data;
    },

    SET_RESPONSE(state, { code, message }) {
      state.response.code = code;
      state.response.message = message;
    },
  },

  actions: {
    /**
     * sending post request to API
     * dispatch token to method attempt
     *
     * @param credentials
     */
    async login({ commit }, credentials) {
      let response;
      try {
        response = await axios.post("/login", credentials);
        commit("SET_TOKEN", response.data.data.access_token);
        // commit("SET_USER", JSON.stringify(response.data.data.user));
        commit("SET_USER", response.data.data.user);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { message } = error.response.data;
        window.alert(message);
        // commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * sending post request to API
     * register user credentials
     *
     * @param {*} _
     * @param {*} credentials
     */
    async register({ commit }, credentials) {
      let response;
      try {
        response = await axios.post("/register", credentials);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let code = error.response.status;
        let { message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * signing out the user
     * clearing all the state
     *
     * @param {*} param
     */
    async logout({ commit }) {
      let response;
      try {
        response = await axios.post("/logout");
        commit("SET_RESPONSE", response.data.data);
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
      } catch (error) {
        commit("SET_RESPONSE", error.response.data.message);
      }
    },

    /**
     * Setting user self data
     * base fetch for store state auth
     *
     * @param {*} param
     */
    async self({ commit, state }) {
      let token = localStorage.getItem("token");
      // if the token is null do not commit mutation
      if (token) {
        commit("SET_TOKEN", token);
      }
      //if the state of the token is null
      //don't continue to the request
      if (!state.token) {
        return;
      }
      // invoke request
      try {
        const response = await axios.get("/user/self");
        commit("SET_USER", response.data.data);
      } catch (e) {
        commit("SET_TOKEN", null);
        commit("SET_USER", null);
      }
    },
  },
};
